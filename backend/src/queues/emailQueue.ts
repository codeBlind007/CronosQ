import { redisConnectionOptions } from "../utils/redis";
import { Queue } from "bullmq";

const emailQueue = new Queue("emailQueue", {
    connection: redisConnectionOptions,
});

export default emailQueue;