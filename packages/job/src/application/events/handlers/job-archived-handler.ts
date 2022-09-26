import { IEventHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { JobArchived } from '@src/domain/events/job-archived';
import { JobUpdated } from '@src/domain/events/job-updated';

@injectable()
export class JobUpdatedEventHandler implements IEventHandler<JobUpdated> {
  public event = JobUpdated.name;

  constructor(@inject(TYPES.Redis) private readonly _redisClient: Redis) {}

  async handle(event: JobArchived) {
    const existing = await this._redisClient.get(`jobs:${event.guid}`);
    if (existing) {
      const job = JSON.parse(existing);
      job.status = event.status;
      job.version = event.version;
      await this._redisClient.set(`jobs:${event.guid}`, JSON.stringify(job));
    }
  }
}
