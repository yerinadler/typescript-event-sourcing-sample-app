import { IQueryHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { GetAllJobsQuery } from '../definitions/get-all-jobs-query';

@injectable()
export class GetAllJobsQueryHandler implements IQueryHandler<GetAllJobsQuery, any> {
  queryToHandle = GetAllJobsQuery.name;

  constructor(@inject(TYPES.Redis) private readonly _redisClient: Redis) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetAllJobsQuery) {
    const keys: string[] = await this._redisClient.keys('jobs:*');
    const jobs: any[] = [];
    for (const key of keys) {
      const job = await this._redisClient.get(key);
      if (job) {
        jobs.push(JSON.parse(job));
      }
    }
    return jobs;
  }
}
