import { IEventHandler } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@src/types';
import { JobCreated } from '@src/domain/events/job-created';

@injectable()
export class JobCreatedEventHandler implements IEventHandler<JobCreated> {
  public event = JobCreated.name;

  constructor(@inject(TYPES.Redis) private readonly _redisClient: Redis) {}

  async handle(event: JobCreated) {
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
