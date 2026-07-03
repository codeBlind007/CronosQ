import { Worker } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";
import jobLifecycleService from "../services/jobLifecycle.services";
import jobEventPublisher from "../events/job.events";
import { JobType } from "../generated/prisma/enums";
import webhookProcessor from "../processors/webhook.processor";

const webhookWorker = new Worker(
  "webhookQueue",
  async (job) => {
    const startTime = Date.now();
    const execution = await jobLifecycleService.start(job);
    await jobEventPublisher.publishStarted(job, JobType.WEBHOOK);

    try {
      console.log("Processing webhook job");

      const result = await webhookProcessor(job);

      await Promise.all([
        jobLifecycleService.complete(job, execution.id, startTime, result),
        jobEventPublisher.publishCompleted(job, JobType.WEBHOOK, result),
      ]);
    } catch (error: any) {
      if (job.attemptsMade + 1 >= job.opts.attempts!) {
        await Promise.all([
          await jobLifecycleService.fail(
            job,
            execution.id,
            startTime,
            error as Error,
          ),
          await jobEventPublisher.publishFailed(
            job,
            JobType.WEBHOOK,
            error as Error,
          ),
        ]);
      } else {
        await Promise.all([
          await jobLifecycleService.retry(
            job,
            execution.id,
            startTime,
            error as Error,
          ),
          await jobEventPublisher.publishRetrying(
            job,
            JobType.WEBHOOK,
            error as Error,
          ),
        ]);
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

webhookWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed`);
});

webhookWorker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed`);
  console.error(err.message);
});

webhookWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

//////////////////////////////////////////////////////////
// Graceful Shutdown
//////////////////////////////////////////////////////////

process.on("SIGINT", async () => {
  console.log("Closing webhook worker...");

  await webhookWorker.close();

  process.exit(0);
});

export default webhookWorker;