import { JobType } from "../../types/jobTypes";
import { JOB_QUEUES } from "./jobs.constants";

export const getQueueName = (jobType: JobType) : string => {
  return JOB_QUEUES[jobType];
};