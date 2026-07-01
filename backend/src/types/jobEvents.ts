import {JobStatus, JobType} from "../generated/prisma/enums";

export interface JobEvent {
    event : "JOB_STARTED" | "JOB_COMPLETED" | "JOB_FAILED" | "JOB_RETRYING" | "JOB_CANCELLED" | "JOB_PAUSED" | "JOB_RESUMED";
    jobId : string;
    type: JobType;
    status: JobStatus;
    executionId?: string;
    attemptsMade?: number;
    timestamp: string,
    message?: string;
}