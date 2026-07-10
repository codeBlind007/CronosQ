import { AppError } from "../../utils/AppError";
import { prisma } from "../../utils/prisma";
import { JobUserBody } from "../../types/jobTypes";
import { getQueueName } from "./jobs.utils";
import queueService from "../../queues/queue.service"

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
            }
        });

        await queueService.scheduleJob(job, clerkId);
        return job;
    } catch (error) {
        console.error(error);
        throw new AppError('Failed to create job', 500);
    }
}

const getJobs = async(userId: string, queryObj?: any) => {
    let {status, type, deadLettered, page, limit} = queryObj || {};
    console.log("service: getJobs", {status, type, deadLettered, page, limit});

    page = page ? parseInt(page) : 1;

    const parsedLimit = limit ? parseInt(limit) : 10;
    const offset = (page - 1) * parsedLimit;

    const jobs = await prisma.job.findMany({
        where: {
            createdBy: {
                clerkId: userId
            },
            status: status ? status : undefined,
            type: type ? type : undefined,
            deadLettered: deadLettered !== undefined ? (deadLettered === 'true') : false
        },
        take: parsedLimit,
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
        },
        include: {
            executions: {
                orderBy: {
                    createdAt: 'desc'
                }
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


const getNotificationById = async (notificationId: string, clerkId: string) => {
    const notification = await prisma.notification.update({
        where: {
            id: notificationId,
            user: {
                clerkId,
            },
        },
        data: {
            isRead: true,
        },
    });
    return notification;
};

const jobsService = {
    createJob,
    getJobs,
    getJobById,
    getNotifications,
    getNotificationById
}

export default jobsService;