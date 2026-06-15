import IORedis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  throw new Error("REDIS_URL is not defined");
}

const redisOptions = {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
  enableOfflineQueue: true,

  retryStrategy: (times: number) => Math.min(times * 50, 2000),

  reconnectOnError: (err: Error) => err.message.includes("READONLY"),
};

// BullMQ reads `url` and passes it as the first ioredis constructor arg.
export const redisConnectionOptions = {
  url: redisUrl,
  ...redisOptions,
};

const connection = new IORedis(redisUrl, redisOptions);

export { connection };

connection.on("error", (err) => {
  console.error("Redis connection error:", err);
});

connection.on("connect", () => {
  console.log("Upstash Redis connected");
});