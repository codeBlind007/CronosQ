import { Job } from "../generated/prisma/client";
import { AppError } from "../utils/AppError";
import queueRegistry from "./queueRegistry";

const scheduleJob = async (job: Job) => {
  try {
    const queue = queueRegistry[job.type as keyof typeof queueRegistry];

    if (!queue) {
      throw new AppError(`No queue registered for job type: ${job.type}`, 500);
    }

    await queue.add(
      job.name,
      { jobId: job.id, payload: job.payload },
      {
        attempts: job.maxRetries || 3,
        backoff: { type: "exponential", delay: job.retryDelaySeconds * 1000 },
      },
    );

    console.log("Waiting:", await queue.getWaiting());
    console.log("Delayed:", await queue.getDelayed());
    console.log("Active:", await queue.getActive());
    console.log("Completed:", await queue.getCompleted());
    console.log("Failed:", await queue.getFailed());
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to schedule job", 500);
  }
};

const queueService = {
  scheduleJob,
};

export default queueService;
