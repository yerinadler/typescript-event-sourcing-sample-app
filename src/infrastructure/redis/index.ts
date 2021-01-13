import { injectable } from 'inversify';
import Redis from 'ioredis';

const client: Redis.Redis = new Redis();

export default client;