import { JobType } from "./jobs.types";
import { JOB_QUEUES } from "./jobs.constants";

export const getQueueName = (jobType: JobType) : string => {
  return JOB_QUEUES[jobType];
};