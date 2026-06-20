import { Worker } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";
import { prisma } from "../utils/prisma";
import { ExecutionStatus, JobStatus } from "../generated/prisma/enums";
import emailProcessor from "../processors/email.processor";

const emailWorker = new Worker(
  "emailQueue",

  async (job) => {
    const startTime = Date.now();

    // Mark main job as RUNNING
    await prisma.job.update({
      where: {
        id: job.data.jobId,
      },
      data: {
        status: JobStatus.RUNNING,
        lastRunAt: new Date(),
      },
    });

    // Create execution record
    const execution = await prisma.jobExecution.create({
      data: {
        job: {
          connect: {
            id: job.data.jobId,
          },
        },

        status: ExecutionStatus.RUNNING,

        attempt: job.attemptsMade + 1,

        startedAt: new Date(),

        ...(job.id && {
          bullJobId: job.id.toString(),
        }),
      },
    });

    try {
      console.log("Processing email job");

      await emailProcessor(job);

      // Simulate failure for testing retries
      if (job.data.payload?.simulateFailure) {
        throw new Error("Intentional failure");
      }

      // Update execution success
      await prisma.jobExecution.update({
        where: {
          id: execution.id,
        },

        data: {
          status: ExecutionStatus.COMPLETED,

          finishedAt: new Date(),

          durationMs: Date.now() - startTime,

          result: {
            success: true,
            processedAt: new Date(),
          },
        },
      });

      // Update main job
      await prisma.job.update({
        where: {
          id: job.data.jobId,
        },

        data: {
          status: JobStatus.COMPLETED,
        },
      });

      return {
        success: true,
      };
    } catch (error: any) {
      // Update failed execution
      await prisma.jobExecution.update({
        where: {
          id: execution.id,
        },

        data: {
          status: ExecutionStatus.FAILED,

          finishedAt: new Date(),

          durationMs: Date.now() - startTime,

          errorMessage: error.message,
        },
      });

      // If retries are exhausted -> mark job failed
      if (job.attemptsMade + 1 >= job.opts.attempts!) {
        await prisma.job.update({
          where: {
            id: job.data.jobId,
          },

          data: {
            status: JobStatus.FAILED,

            deadLettered: true,
          },
        });
      } else {
        // Job will retry
        await prisma.job.update({
          where: {
            id: job.data.jobId,
          },

          data: {
            status: JobStatus.QUEUED,
          },
        });
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