import { IEvent } from '@core/IEvent';
import { IEventPublisher } from '@core/IEventPublisher';
import { injectable } from 'inversify';
import { classToPlain } from 'class-transformer';
import Redis from 'ioredis';

@injectable()
export class EventPublisher implements IEventPublisher {
  private readonly redis: Redis.Redis = new Redis();

  async publish(channel: string, event: IEvent): Promise<void> {
    const payload: string = JSON.stringify(classToPlain(event));
    await this.redis.publish(channel, payload);
  }
}