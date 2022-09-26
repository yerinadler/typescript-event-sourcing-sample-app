import { IEventHandler } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { ApplicationCreated } from '@src/domain/events/application-created';
import { TYPES } from '@src/types';

@injectable()
export class ApplicationCreatedEventHandler implements IEventHandler<ApplicationCreated> {
  public event = ApplicationCreated.name;

  constructor(@inject(TYPES.Redis) private readonly _redisClient: Redis) {}

  async handle(event: ApplicationCreated) {
    await this._redisClient.set(
      `application:${event.guid}`,
      JSON.stringify({
        guid: event.guid,
        jobId: event.jobId,
        firstname: event.firstname,
        lastname: event.lastname,
        email: event.email,
        currentPosition: event.currentPosition,
        version: event.version,
      })
    );
  }
}
