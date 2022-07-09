import { BASE_TYPES } from '@common/types';
import { IEventHandler } from '@cqrs-es/core';

// import { ApplicationCreated } from '@s /application/domain/events/application-created';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { ApplicationCreated } from '../../../domain/events/application-created';

@injectable()
export class ApplicationCreatedEventHandler implements IEventHandler<ApplicationCreated> {
  public event = ApplicationCreated.name;

  constructor(@inject(BASE_TYPES.Redis) private readonly _redisClient: Redis) {}

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
