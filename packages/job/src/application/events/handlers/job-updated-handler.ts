import { IEventHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { JobUpdated } from '@src/domain/events/job-updated';

@injectable()
export class JobUpdatedEventHandler implements IEventHandler<JobUpdated> {
  public event = JobUpdated.name;

  constructor(@inject(TYPES.Redis) private readonly _redisClient: Redis) {}

  async handle(event: JobUpdated) {
    await this._redisClient.set(
      `jobs:${event.guid}`,
      JSON.stringify({
        guid: event.guid,
        title: event.title,
        description: event.description,
        status: event.status,
        version: event.version,
      })
    );
  }
}
