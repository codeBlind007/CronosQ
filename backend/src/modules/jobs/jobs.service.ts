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

const jobsService = {
    createJob
}

export default jobsService;