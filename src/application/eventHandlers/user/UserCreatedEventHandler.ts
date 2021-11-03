import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';
import { UserCreated } from '@domain/user/events/UserCreated';

@injectable()
export class UserCreatedEventHandler implements IEventHandler<UserCreated> {

  public event: string = UserCreated.name;

  constructor(
    @inject(TYPES.Redis) private readonly redisClient: Redis
  ) {}

  async handle(message: string) {
    const event = JSON.parse(message);
    this.redisClient.set(`users:${event.guid}`, JSON.stringify({
      email: event.email,
      firstname: event.firstname,
      lastname: event.lastname,
      dateOfBirth: event.dateOfBirth.toString()
    }));
  }
}