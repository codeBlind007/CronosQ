import { Queue } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";

const reminderQueue = new Queue("reminderQueue", {
    connection: redisConnectionOptions,
});

export default reminderQueue;