import Redis from 'ioredis';

export const getRedisClient = (): Redis.Redis => {
  return new Redis();
};