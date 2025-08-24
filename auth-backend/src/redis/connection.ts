import { createClient } from "redis";

let redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});
const initializeRedisConnection = async () => {
  try {
    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
    await redisClient.connect();
    console.log("Redis client connected successfully");
  } catch (error) {
    console.log("Error connecting to Redis:", error);
    throw error;
  }
};

export { redisClient, initializeRedisConnection };
