import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/prisma";
import { JobUserBody } from "../../types/jobTypes";
import { getQueueName } from "./jobs.utils";
import queueService from "../../queues/queue.service"

const createJob = async (jobData: JobUserBody, userId: string) => {
    console.log("service: createJob");
    try {
        const job = await prisma.job.create({
            data: {
                ...jobData,
                queueName: getQueueName(jobData.type),
                createdBy: {
                    connect: {
                        clerkId: userId,
                    },
                },
            }
        });

        await queueService.scheduleJob(job);
        return job;
    } catch (error) {
        console.error(error);
        throw new AppError('Failed to create job', 500);
    }
}

const getJobs = async(userId: string, queryObj?: any) => {
    let {status, type, deadLettered, page} = queryObj || {};
    console.log("service: getJobs", {status, type, deadLettered, page});
    page = page ? parseInt(page) : 1;
    const limit = 2;
    const offset = (page - 1) * limit;
    const jobs = await prisma.job.findMany({
        where: {
            createdBy: {
                clerkId: userId
            },
            status: status ? status : undefined,
            type: type ? type : undefined,
            deadLettered: deadLettered !== undefined ? deadLettered : undefined
        },
        take: limit,
        skip: offset,
        orderBy: {
            createdAt: 'desc'
        }
    });
    return jobs;
}

const getJobById = async(jobId: string, userId: string) => {
    const job = await prisma.job.findFirst({
        where: {
            id: jobId,
            createdBy: {
                clerkId: userId
            }
        }
    });
    return job;
}

const getNotifications = async (clerkId: string) => {
  return prisma.notification.findMany({
    where: {
      user: {
        clerkId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const jobsService = {
    createJob,
    getJobs,
    getJobById,
    getNotifications
}

export default jobsService;