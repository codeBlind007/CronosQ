import { Queue } from "bullmq";
import { redisConnectionOptions } from "../utils/redis";

const reportQueue = new Queue("reportQueue", {
    connection: redisConnectionOptions,
});

export default reportQueue;