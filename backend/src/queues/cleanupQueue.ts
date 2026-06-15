import { Queue } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";

const cleanupQueue = new Queue("cleanupQueue", {
    connection: redisConnectionOptions,
});

export default cleanupQueue;