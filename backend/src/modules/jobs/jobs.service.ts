import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/prisma";
import { JobUserBody } from "../../types/jobTypes";
import { getQueueName } from "./jobs.utils";
import queueService from "../../queues/queue.service";

const createJob = async (jobData: JobUserBody, clerkId: string) => {
  console.log("service: createJob");
  try {
    const job = await prisma.job.create({
      data: {
        ...jobData,
        queueName: getQueueName(jobData.type),
        createdBy: {
          connect: {
            clerkId: clerkId,
          },
        },
      },
    });

    await queueService.scheduleJob(job, clerkId);
    return job;
  } catch (error) {
    console.error(error);
    throw new AppError("Failed to create job", 500);
  }
};

const getJobs = async (userId: string, queryObj?: any) => {
  let { status, type, deadLettered, page, limit } = queryObj || {};
  console.log("service: getJobs", { status, type, deadLettered, page, limit });

  page = page ? parseInt(page) : 1;

  const parsedLimit = limit ? parseInt(limit) : 10;
  const offset = (page - 1) * parsedLimit;

  const jobs = await prisma.job.findMany({
    where: {
      createdBy: {
        clerkId: userId,
      },
      status: status ? status : undefined,
      type: type ? type : undefined,
      deadLettered:
        deadLettered !== undefined ? deadLettered === "true" : false,
    },
    take: parsedLimit,
    skip: offset,
    orderBy: {
      createdAt: "desc",
    },
  });
  return jobs;
};

const getJobById = async (jobId: string, userId: string) => {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      createdBy: {
        clerkId: userId,
      },
    },
    include: {
      executions: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return job;
};

const jobStats = async (userId: string) => {
  const stats = await prisma.job.groupBy({
    by: ["status"],
    where: {
      createdBy: {
        clerkId: userId,
      },
    },
    _count: {
      status: true,
    },
  });

  const result = {
    totalJobs: 0,
    completedJobs: 0,
    failedJobs: 0,
    cancelledJobs: 0,
    pendingJobs: 0,
  };

  for (const row of stats) {
    result.totalJobs += row._count.status;

    switch (row.status) {
      case "COMPLETED":
        result.completedJobs = row._count.status;
        break;
      case "FAILED":
        result.failedJobs = row._count.status;
        break;
      case "CANCELLED":
        result.cancelledJobs = row._count.status;
        break;
      case "PENDING":
        result.pendingJobs = row._count.status;
        break;
    }
  }

  return result;
};

const jobsService = {
  createJob,
  getJobs,
  getJobById,
  jobStats,
};

export default jobsService;
