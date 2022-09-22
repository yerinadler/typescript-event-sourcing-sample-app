import { IEventHandler } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { BASE_TYPES } from '@common/types';
import { JobUpdated } from '@src/job/domain/events/job-updated';

@injectable()
export class JobUpdatedEventHandler implements IEventHandler<JobUpdated> {
  public event = JobUpdated.name;

  constructor(@inject(BASE_TYPES.Redis) private readonly _redisClient: Redis) {}

  async handle(event: JobUpdated) {
    await this._redisClient.set(
      `jobs:${event.guid}`,
      JSON.stringify({
        guid: event.guid,
        title: event.title,
        description: event.description,
        version: event.version,
      })
    );
  }
}
