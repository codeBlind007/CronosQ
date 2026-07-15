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
    clerkId: job.data.clerkId,
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

async function publishCompleted(job: Job, type: JobType, response?: any) {
  await publish(
    JOB_EVENTS_CHANNEL,

    buildEvent(job, "JOB_COMPLETED", type, JobStatus.COMPLETED, {
      response,
    }),
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

async function publishJobNotificationCompleted(job: Job, type: JobType, message: string) {
  console.log("Publishing job notification completed event for job:", job.id);
  await publish(
    JOB_EVENTS_CHANNEL,

    buildEvent(job, "JOB_COMPLETED_NOTIFICATION", type, JobStatus.COMPLETED, {
      message,
    }),
  );
}

async function publishJobNotificationFailed(job: Job, type: JobType, message: string) {
  console.log("Publishing job notification failed event for job:", job.id);
  await publish(
    JOB_EVENTS_CHANNEL, 

    buildEvent(job, "JOB_FAILED_NOTIFICATION", type, JobStatus.FAILED, {
      message,
    }),
  );
}

const jobEventPublisher = {
  publishStarted,
  publishCompleted,
  publishRetrying,
  publishFailed,
  publishJobNotificationCompleted,
  publishJobNotificationFailed,
};

export default jobEventPublisher;
