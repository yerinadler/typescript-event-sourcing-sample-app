import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { UserCreated } from '@domain/user/events/UserCreated';

@injectable()
export class AuthorCreatedEventHandler implements IEventHandler<UserCreated> {
  public event = UserCreated.name;

  constructor(@inject(TYPES.Redis) private readonly redisClient: Redis) {}

  async handle(event: UserCreated) {
    this.redisClient.set(
      `authors:${event.guid}`,
      JSON.stringify({
        firstname: event.firstname,
        lastname: event.lastname,
      })
    );
  }
}
