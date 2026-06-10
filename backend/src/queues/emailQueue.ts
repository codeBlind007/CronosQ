import { connection } from "../utils/redis";
import { Queue } from "bullmq";

export const emailQueue = new Queue("emailQueue", {
    connection,
});