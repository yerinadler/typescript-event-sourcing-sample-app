import { injectable, unmanaged } from 'inversify';
import { Collection } from 'mongodb';

import { ConcurrencyException, NotFoundException } from '@core/ApplicationError';
import { EventDescriptor } from '@core/EventDescriptor';
import { IEvent } from '@core/IEvent';
import { IEventBus } from '@core/IEventBus';
import { IEventStore } from '@core/IEventStore';

@injectable()
export abstract class EventStore implements IEventStore {
  constructor(
    @unmanaged() private readonly eventCollection: Collection,
    @unmanaged() private readonly _eventBus: IEventBus
  ) {}

  async saveEvents(aggregateGuid: string, events: IEvent[], expectedVersion: number) {
    const operations: any[] = [];

    const latestEvent = await this.getLastEventDescriptor(aggregateGuid);

    if (latestEvent && latestEvent.version !== expectedVersion && expectedVersion !== -1) {
      throw new ConcurrencyException('Cannot perform the operation due to internal conflict');
    }

    let i: number = expectedVersion;

    for (const event of events) {
      i++;
      event.version = i;
      const eventObject = new EventDescriptor(aggregateGuid, event.aggregateName, event, i);
      this._eventBus.publish(event.aggregateName, event);
      operations.push({ insertOne: eventObject });
    }

    await this.eventCollection.bulkWrite(operations);
  }

  async getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]> {
    const events = await this.eventCollection.find({ aggregateGuid }).toArray();
    if (!events.length) {
      throw new NotFoundException('Aggregate with the requested Guid does not exist');
    }
    return events.map((eventDescriptor: EventDescriptor) => eventDescriptor.payload);
  }

  private async getLastEventDescriptor(aggregateGuid: string) {
    const [latestEvent] = await this.eventCollection.find({ aggregateGuid }, { sort: { _id: -1 } }).toArray();
    return latestEvent;
  }
}
