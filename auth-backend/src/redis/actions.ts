import { redisClient } from "./connection";

const setCache = async (key: string, data: string, EX: number) => {
  try {
    await redisClient.set(key, data, { expiration: { type: "EX", value: EX } }); // Set cache with 1 hour expiration
  } catch (error) {
    console.error("Error setting cache:", error);
    throw new Error("Failed to set cache");
  }
};

const getCache = (key: string) => {
  try {
    const value = redisClient.get(key);
    if (value) {
      return value;
    }
  } catch (error) {
    console.error("Error getting cache:", error);
    throw new Error("Failed to get cache");
  }
};

export { setCache, getCache };
