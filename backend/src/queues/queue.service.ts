import { Job } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import queueRegistry from "./queueRegistry";

const scheduleJob = async (job: Job, clerkId: string) => {
  try {
    const queue = queueRegistry[job.type as keyof typeof queueRegistry];

    if (!queue) {
      throw new AppError(
        `No queue registered for job type: ${job.type}`,
        500
      );
    }
    console.log("scheduledAt:", job.scheduledAt);
    
    const delay = job.scheduledAt
      ? Math.max(0, new Date(job.scheduledAt).getTime() - Date.now())
      : 0;
    
    
    console.log("Computed delay:", delay);
    
    await queue.add(
      job.name,
      {
        jobId: job.id,
        payload: job.payload,
        userId : job.createdById,
        clerkId: clerkId,
        type: job.type,
        name: job.name,
      },
      {
        jobId: job.id,
        attempts: job.maxRetries || 3,
        backoff: {
          type: "exponential",
          delay: (job.retryDelaySeconds ?? 60) * 1000,
        },
        delay,
      }
    );

    const delayed = await queue.getDelayed();
    console.log("Delayed: ", delayed);

  } catch (error) {
    console.error(error);
    throw new AppError("Failed to schedule job", 500);
  }
};

const queueService = {
  scheduleJob,
};

export default queueService;
