import { IQueryHandler } from '@ayerin/ddd-base';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { BASE_TYPES } from '@common/types';

import { GetAllApplicationsQuery } from '../definitions/get-all-applications-query';

@injectable()
export class GetAllApplicationsQueryHandler implements IQueryHandler<GetAllApplicationsQuery, any> {
  queryToHandle = GetAllApplicationsQuery.name;

  constructor(@inject(BASE_TYPES.Redis) private readonly _redisClient: Redis) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(query: GetAllApplicationsQuery) {
    const keys: string[] = await this._redisClient.keys('application:*');
    const applications: any[] = [];
    for (const key of keys) {
      const application = await this._redisClient.get(key);
      if (application) {
        applications.push(JSON.parse(application));
      }
    }
    return applications;
  }
}
