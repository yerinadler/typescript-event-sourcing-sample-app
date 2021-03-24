import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { inject, injectable } from 'inversify';
import Event from 'events';
import Redis from 'ioredis';
import { UserCreated } from '@domain/user/events/UserCreated';
import { UserEvent } from '@domain/user/events';

@injectable()
export class AuthorCreatedEventHandler implements IEventHandler<UserEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis.Redis,
  ) {}

  async handle() {
    this.eventBus.on(UserCreated.name, async (event) => {
      this.redisClient.set(`authors:${event.guid}`, JSON.stringify({
        firstname: event.firstname,
        lastname: event.lastname
      }));
    });
  }
}