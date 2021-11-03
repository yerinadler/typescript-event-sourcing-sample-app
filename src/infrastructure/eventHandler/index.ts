import { inject, injectable, multiInject } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@constants/types';
import { IEvent } from '@core/IEvent';
import { IEventHandler } from '@core/IEventHandler';

@injectable()
export class EventHandler {
  constructor(
    @multiInject(TYPES.Event) private readonly eventHandlers: IEventHandler<IEvent>[],
    @inject(TYPES.EventSubscriber) private readonly eventSubscriber: Redis
  ) {}

  async initialise() {
    this.eventSubscriber.on('message', async (channel: string, message: string) => {
      const matchedHandlers: IEventHandler<IEvent>[] = this.eventHandlers.filter(
        (handler) => handler.event === channel
      );

      await Promise.all(
        matchedHandlers.map((handler: IEventHandler<IEvent>) => {
          handler.handle(message);
        })
      );
    });
  }
}
