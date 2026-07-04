import {Worker} from "bullmq";
import { redisConnectionOptions } from "../utils/redis";
import jobLifecycleService from "../services/jobLifecycle.services";
import jobEventPublisher from "../events/job.events";
import { JobType } from "../generated/prisma/enums";
import { AppError } from "../utils/AppError";

const reminderWorker = new Worker(
    "reminderQueue",
    async(job) => {
        const startTime = Date.now();
        const execution = await jobLifecycleService.start(job);
        await jobEventPublisher.publishStarted(job, JobType.REMINDER);

        try{
            console.log("Processing reminder job");

            const response = await reminderProcessor(job);

            await Promise.all([
                jobLifecycleService.complete(job, execution.id, startTime, response),
                jobEventPublisher.publishCompleted(job, JobType.REMINDER, response)
            ])

        }catch(error: any){
            if(job.attemptsMade + 1 >= job.opts.attempts!){
                await Promise.all([
                    jobLifecycleService.fail(job, execution.id, startTime, error as Error),
                    jobEventPublisher.publishFailed(job, JobType.REMINDER, error as Error)
                ])
            } else{
                await Promise.all([
                    jobLifecycleService.retry(job, execution.id, startTime, error as Error),
                    jobEventPublisher.publishRetrying(job, JobType.REMINDER, error as Error)
                ])
            }

            throw error;
        }
    },

    {
        connection: redisConnectionOptions,

        concurrency: 5,
    }
)

//////////////////////////////////////////////////////////
// Worker Events
//////////////////////////////////////////////////////////

reminderWorker.on("completed", async (job) => {
  console.log(`Job ${job.id} completed`);
});

reminderWorker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed`);
  console.error(err.message);
});

reminderWorker.on("error", (err) => {
  console.error("Worker error:", err);
});

//////////////////////////////////////////////////////////
// Graceful Shutdown
//////////////////////////////////////////////////////////

process.on("SIGINT", async () => {
  console.log("Closing reminder worker...");

  await reminderWorker.close();

  process.exit(0);
});