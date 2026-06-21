import { Job } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import queueRegistry from "./queueRegistry";

const scheduleJob = async (job: Job) => {
  try {
    const queue = queueRegistry[job.type as keyof typeof queueRegistry];

    if (!queue) {
      throw new AppError(
        `No queue registered for job type: ${job.type}`,
        500
      );
    }

    const delay = job.scheduledAt
      ? Math.max(0, new Date(job.scheduledAt).getTime() - Date.now())
      : 0;

    await queue.add(
      job.name,
      {
        jobId: job.id,
        payload: job.payload,
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

    const completed = await queue.getCompleted();
    console.log("Completed: ", completed);

  } catch (error) {
    console.error(error);
    throw new AppError("Failed to schedule job", 500);
  }
};

const queueService = {
  scheduleJob,
};

export default queueService;
