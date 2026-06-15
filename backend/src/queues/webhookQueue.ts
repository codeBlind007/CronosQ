import { Queue } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";

const webhookQueue = new Queue("webhookQueue", {
    connection: redisConnectionOptions,
});

export default webhookQueue;