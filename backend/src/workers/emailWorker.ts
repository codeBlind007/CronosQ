import {Worker} from 'bullmq';
import { redisConnectionOptions } from "../utils/redis";

const emailWorker = new Worker(
    "emailQueue",
    async (job) => {
        console.log("Processing email job");
    }
)