import { Redis, default as RedisClient } from 'ioredis';

const client: Redis = new RedisClient();

export default client;
