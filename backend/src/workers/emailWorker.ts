import { Worker } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";
import emailProcessor from "../processors/email.processor";
import jobLifecycleService from "../services/jobLifecycle.services";
import jobEventPublisher from "../events/job.events";
import { JobType } from "../generated/prisma/enums";

const emailWorker = new Worker(
  "emailQueue",

  async (job) => {

    const startTime = Date.now();
    const execution = await jobLifecycleService.start(job);
    await jobEventPublisher.publishStarted(job, JobType.EMAIL);

    try {
      console.log("Processing email job");

      await emailProcessor(job);

      await Promise.all([
        jobLifecycleService.complete(job, execution.id, startTime),
        jobEventPublisher.publishCompleted(job, JobType.EMAIL)
      ])

      return {
        success: true,
      };
    } catch (error: any) {
      if (job.attemptsMade + 1 >= job.opts.attempts!) {
        await Promise.all([
          jobLifecycleService.fail(job, execution.id, startTime, error as Error),
          jobEventPublisher.publishFailed(job, JobType.EMAIL, error as Error)
        ])
      } else {
        await Promise.all([
          jobLifecycleService.retry(job, execution.id, startTime, error as Error),
          jobEventPublisher.publishRetrying(job, JobType.EMAIL, error as Error)
        ])
      }

      throw error;
    }
  },

  {
    connection: redisConnectionOptions,

    concurrency: 5,
  },
);

//////////////////////////////////////////////////////////
// Worker Events
//////////////////////////////////////////////////////////

emailWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed`);
  console.error(err.message);
});

emailWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

//////////////////////////////////////////////////////////
// Graceful Shutdown
//////////////////////////////////////////////////////////

process.on("SIGINT", async () => {
  console.log("Closing email worker...");

  await emailWorker.close();

  process.exit(0);
});

export default emailWorker;
