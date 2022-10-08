import { EventDescriptor, IEvent, IEventBus, IEventHandler, rehydrateEventFromDescriptor } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { classToPlain } from 'class-transformer';
import { inject, injectable, multiInject } from 'inversify';
import { Consumer, Producer } from 'kafkajs';

@injectable()
export class KafkaEventBus implements IEventBus {
  constructor(
    @multiInject(TYPES.Event) private readonly eventHandlers: IEventHandler<IEvent>[],
    @inject(TYPES.KafkaConsumer) private readonly _subscriber: Consumer,
    @inject(TYPES.KafkaProducer) private readonly _producer: Producer
  ) {}

  async publish(channel: string, eventDescriptor: EventDescriptor): Promise<void> {
    const payload: string = JSON.stringify({ ...classToPlain(eventDescriptor) });
    await this._producer.send({
      topic: channel,
      messages: [
        {
          key: eventDescriptor.aggregateGuid,
          value: payload,
        },
      ],
    });
  }

  async subscribeEvents(): Promise<void> {
    await this._subscriber.run({
      eachMessage: async ({ message, heartbeat }) => {
        if (message.value) {
          const eventDescriptor = JSON.parse(message.value.toString());
          const matchedHandlers: IEventHandler<IEvent>[] = this.eventHandlers.filter(
            (handler) => handler.event === eventDescriptor.eventName
          );
          await Promise.all(
            matchedHandlers.map((handler: IEventHandler<IEvent>) => {
              handler.handle(rehydrateEventFromDescriptor(eventDescriptor));
            })
          );
          await heartbeat();
        }
      },
    });
  }
}
