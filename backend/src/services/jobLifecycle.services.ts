import {Job} from "bullmq";
import { prisma } from "../utils/prisma";
import { ExecutionStatus, JobStatus } from "../generated/prisma/enums";


export async function start(job: Job) {
  const [, execution] = await Promise.all([
    prisma.job.update({
      where: {
        id: job.data.jobId,
      },
      data: {
        status: JobStatus.RUNNING,
        lastRunAt: new Date(),
      },
    }),

    prisma.jobExecution.create({
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
    }),
  ]);

  return execution;
}

export async function complete(
  job: Job,
  executionId: string,
  startTime: number,
  result?: Record<string, any>,
) {
  const finishedAt = new Date();

  await Promise.all([
    prisma.jobExecution.update({
      where: {
        id: executionId,
      },

      data: {
        status: ExecutionStatus.COMPLETED,

        finishedAt,

        durationMs: finishedAt.getTime() - startTime,

        result:
          result ??
          {
            success: true,
            processedAt: finishedAt,
          },
      },
    }),

    prisma.job.update({
      where: {
        id: job.data.jobId,
      },

      data: {
        status: JobStatus.COMPLETED,
      },
    }),
  ]);
}

export async function retry(
  job: Job,
  executionId: string,
  startTime: number,
  error: Error,
) {
  const finishedAt = new Date();

  await Promise.all([
    prisma.jobExecution.update({
      where: {
        id: executionId,
      },

      data: {
        status: ExecutionStatus.FAILED,

        finishedAt,

        durationMs: finishedAt.getTime() - startTime,

        errorMessage: error.message,
      },
    }),

    prisma.job.update({
      where: {
        id: job.data.jobId,
      },

      data: {
        status: JobStatus.QUEUED,
      },
    }),
  ]);
}

export async function fail(
  job: Job,
  executionId: string,
  startTime: number,
  error: Error,
) {
  const finishedAt = new Date();

  await Promise.all([
    prisma.jobExecution.update({
      where: {
        id: executionId,
      },

      data: {
        status: ExecutionStatus.FAILED,

        finishedAt,

        durationMs: finishedAt.getTime() - startTime,

        errorMessage: error.message,
      },
    }),

    prisma.job.update({
      where: {
        id: job.data.jobId,
      },

      data: {
        status: JobStatus.FAILED,

        deadLettered: true,
      },
    }),
  ]);
}

const jobLifecycleServices = {
  start,
  complete,
  retry,
  fail,
};

export default jobLifecycleServices;