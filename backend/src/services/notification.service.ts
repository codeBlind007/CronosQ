import { prisma } from "../utils/prisma";
import { NotificationEventType } from "../generated/prisma/enums";

interface CreateNotificationInput {
  clerkId: string;
  jobId?: string;
  title: string;
  message: string;
  type: NotificationEventType;
  metadata?: Record<string, any>;
}

const createNotification = async ({
  clerkId,
  jobId,
  title,
  message,
  type,
  metadata,
}: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      user: {
        connect: {
          clerkId,
        },
      },
      ...(jobId !== undefined ? { job: { connect: { id: jobId } } } : {}),
      title,
      message,
      type,
      ...(metadata !== undefined ? { metadata } : {}),
    },
  });
};

const notificationService = {
  createNotification,
};

export default notificationService;
