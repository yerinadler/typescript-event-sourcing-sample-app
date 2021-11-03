import RedisClient, { Redis } from 'ioredis';

export const getRedisClient = (): Redis => {
  return new RedisClient();
};
