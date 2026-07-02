import { Job } from "bullmq";
import { JOB_EVENTS_CHANNEL, publish } from "../utils/redis";
import { JobStatus, JobType } from "../generated/prisma/enums";

function buildEvent(
  job: Job,
  event: string,
  type: JobType,
  status: JobStatus,
  extra: Record<string, any> = {},
) {
  return {
    event,
    jobId: job.data.jobId,
    userId: job.data.userId,
    name: job.data.name,
    type,

    status,

    attemptsMade: job.attemptsMade,

    timestamp: new Date().toISOString(),

    ...extra,
  };
}

async function publishStarted(job: Job, type: JobType) {
  await publish(
    JOB_EVENTS_CHANNEL,

    buildEvent(job, "JOB_STARTED", type, JobStatus.RUNNING),
  );
}

async function publishCompleted(job: Job, type: JobType) {
  await publish(
    JOB_EVENTS_CHANNEL,

    buildEvent(job, "JOB_COMPLETED", type, JobStatus.COMPLETED),
  );
}

async function publishRetrying(job: Job, type: JobType, error: Error) {
  await publish(
    JOB_EVENTS_CHANNEL,

    buildEvent(job, "JOB_RETRYING", type, JobStatus.QUEUED, {
      error: error.message,
    }),
  );
}

async function publishFailed(job: Job, type: JobType, error: Error) {
  await publish(
    JOB_EVENTS_CHANNEL,

    buildEvent(job, "JOB_FAILED", type, JobStatus.FAILED, {
      error: error.message,
    }),
  );
}

const jobEventPublisher = {
  publishStarted,
  publishCompleted,
  publishRetrying,
  publishFailed,
};

export default jobEventPublisher;
