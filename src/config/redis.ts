import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_CONNECTION,
});

redisClient.connect().catch(console.error);

export const saveToCache = async (key: string, value: string) => {
  await redisClient.set(key, value, { EX: 60 * 10 });
};

export const getFromCache = async (key: string) => {
  const value = await redisClient.get(key);

  return value;
};

export const removeFromCache = async (key: string) => {
  await redisClient.del(key);
};
