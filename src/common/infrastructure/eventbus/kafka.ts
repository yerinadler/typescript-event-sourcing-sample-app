import { IEvent, IEventBus, IEventHandler } from '@ayerin/ddd-base';
import { classToPlain } from 'class-transformer';
import { inject, injectable, multiInject } from 'inversify';
import { Consumer, Producer } from 'kafkajs';

import { BASE_TYPES } from '@common/types';

@injectable()
export class KafkaEventBus implements IEventBus {
  constructor(
    @multiInject(BASE_TYPES.Event) private readonly eventHandlers: IEventHandler<IEvent>[],
    @inject(BASE_TYPES.KafkaConsumer) private readonly _subscriber: Consumer,
    @inject(BASE_TYPES.KafkaProducer) private readonly _producer: Producer
  ) {}

  async publish(channel: string, event: IEvent): Promise<void> {
    const payload: string = JSON.stringify({ pattern: event.eventName, ...classToPlain(event) });
    await this._producer.send({
      topic: channel,
      messages: [
        {
          key: event.aggregateId,
          value: payload,
        },
      ],
    });
  }

  async subscribeEvents(): Promise<void> {
    await this._subscriber.run({
      eachMessage: async ({ message, heartbeat }) => {
        if (message.value) {
          const event = JSON.parse(message.value.toString());
          const matchedHandlers: IEventHandler<IEvent>[] = this.eventHandlers.filter(
            (handler) => handler.event === event.pattern
          );
          await Promise.all(
            matchedHandlers.map((handler: IEventHandler<IEvent>) => {
              handler.handle(event);
            })
          );
          await heartbeat();
        }
      },
    });
  }
}
