import { Job } from "bullmq";
import { prisma } from "../utils/prisma";
import emailService from "../services/email.service";
import { AppError } from "../utils/AppError";
import { NotificationEventType } from "../generated/prisma/enums";
import notificationService from "../services/notification.service";

async function reminderProcessor(job: Job) {
  try {
    console.log(`Processing reminder job with id: ${job.id}`);
    console.log('reminder processor: ', job);
    const { payload, userId, jobId } = job.data;
    const { title, message, channels } = payload;
    console.log(`Reminder job data:`, userId);
    
    if (channels?.includes("EMAIL")) {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          email: true,
        },
      });

      if (!user?.email) {
        throw new AppError("User email not found", 404);
      }

      await emailService(user.email, title, message);
    }

    // Save in-app notification
    const notification = await notificationService.createNotification({
      userId,
      jobId,
      title,
      message,
      type: NotificationEventType.REMINDER,
      metadata: {
        channels,
      },
    });

    return {
      success: true,
      notificationId: notification.id,
      title,
      message,
    };
  } catch (error) {
    console.error("Error processing reminder job:", error);

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("Failed to process reminder", 500);
  }
}

export default reminderProcessor;
