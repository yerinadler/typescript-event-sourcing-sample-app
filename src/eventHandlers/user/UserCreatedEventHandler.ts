import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { UserEvent } from '@domain/user/events';
import { UserCreated } from '@domain/user/events/UserCreated';
import Event from 'events';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

@injectable()
export class UserCreatedEventHandler implements IEventHandler<UserEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis
  ) {}

  async handle() {
    this.eventBus.on(UserCreated.name, async (event) => {
      this.redisClient.set(`users:${event.guid}`, JSON.stringify({
        email: event.email,
        firstname: event.firstname,
        lastname: event.lastname,
        dateOfBirth: event.dateOfBirth.toString()
      }));
    });
  }
}