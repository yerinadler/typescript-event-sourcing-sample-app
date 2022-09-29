import { ApplicationError, IEventHandler, NotFoundException } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { ApplicationCreated } from '@src/domain/events/application-created';
import { TYPES } from '@src/types';

@injectable()
export class ApplicationCreatedEventHandler implements IEventHandler<ApplicationCreated> {
  public event = ApplicationCreated.name;

  constructor(@inject(TYPES.Redis) private readonly _redisClient: Redis) {}

  async handle(event: ApplicationCreated) {
    const job = await this._redisClient.get(`job-repl:${event.jobId}`);

    if (!job) {
      throw new NotFoundException('The related job does not exist or is in sync');
    }
    
    const parsedJob = JSON.parse(job);
    await this._redisClient.set(
      `application:${event.guid}`,
      JSON.stringify({
        guid: event.guid,
        jobId: event.jobId,
        jobTitle: parsedJob.title,
        firstname: event.firstname,
        lastname: event.lastname,
        email: event.email,
        currentPosition: event.currentPosition,
        version: event.version,
      })
    );
  }
}
