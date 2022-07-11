import { IEvent, IEventBus, IEventHandler } from '@cqrs-es/core';
import { classToPlain } from 'class-transformer';
import { injectable, inject, multiInject } from 'inversify';
import { Redis } from 'ioredis';

import { BASE_TYPES } from '@common/types';

@injectable()
export class RedisEventBus implements IEventBus {
  constructor(
    @multiInject(BASE_TYPES.Event) private readonly eventHandlers: IEventHandler<IEvent>[],
    @inject(BASE_TYPES.RedisSubscriber) private readonly _subscriber: Redis,
    @inject(BASE_TYPES.Redis) private readonly _redis: Redis
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
