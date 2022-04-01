import { classToPlain } from 'class-transformer';
import { injectable, inject, multiInject } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@constants/types';
import { IEvent } from '@core/IEvent';
import { IEventBus } from '@core/IEventBus';
import { IEventHandler } from '@core/IEventHandler';

@injectable()
export class RedisEventBus implements IEventBus {
  constructor(
    @multiInject(TYPES.Event) private readonly eventHandlers: IEventHandler<IEvent>[],
    @inject(TYPES.RedisSubscriber) private readonly _subscriber: Redis,
    @inject(TYPES.Redis) private readonly _redis: Redis
  ) {}

  async publish(channel: string, event: IEvent): Promise<void> {
    const payload: string = JSON.stringify({ pattern: event.eventName, ...classToPlain(event) });
    await this._redis.publish(channel, payload);
  }

  async subscribeEvents(): Promise<void> {
    this._subscriber.on('message', async (channel: string, message: string) => {
      const event = JSON.parse(message);
      const matchedHandlers: IEventHandler<IEvent>[] = this.eventHandlers.filter(
        (handler) => handler.event === event.pattern
      );

      await Promise.all(
        matchedHandlers.map((handler: IEventHandler<IEvent>) => {
          handler.handle(event);
        })
      );
    });
  }
}
