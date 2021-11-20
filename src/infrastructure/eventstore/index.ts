import { Collection } from 'mongodb';

import { ConcurrencyException, NotFoundException } from '@core/ApplicationError';
import { EventDescriptor } from '@core/EventDescriptor';
import { IEvent } from '@core/IEvent';
import { IEventBus } from '@core/IEventBus';
import { IEventStore } from '@core/IEventStore';
export class EventStore implements IEventStore {
  constructor(private readonly eventCollection: Collection, private readonly _eventBus: IEventBus) {}

  async saveEvents(aggregateGuid: string, events: IEvent[], expectedVersion: number) {
    const operations: any[] = [];

    // Try to get the latest event for the aggregate
    const latestEvent = await this.getLastEventDescriptor(aggregateGuid);
    // If it does not exist, create the new empty EventDescriptor
    if (latestEvent && latestEvent.version !== expectedVersion && expectedVersion !== -1) {
      throw new ConcurrencyException('Cannot perform the operation due to internal conflict');
    }

    let i: number = expectedVersion;

    for (const event of events) {
      i++;
      event.version = i;
      const eventObject = new EventDescriptor(aggregateGuid, { eventType: event.constructor.name, ...event }, i);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this._eventBus.publish(eventObject.eventPayload.eventType!, event);
      operations.push({ insertOne: eventObject });
    }

    await this.eventCollection.bulkWrite(operations);
  }

  async getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]> {
    const events = await this.eventCollection.find({ aggregateGuid }).toArray();
    if (!events.length) {
      throw new NotFoundException('Aggregate with the requested Guid does not exist');
    }
    return events.map((eventDescriptor: EventDescriptor) => eventDescriptor.eventPayload);
  }

  private async getLastEventDescriptor(aggregateGuid: string) {
    const [latestEvent] = await this.eventCollection.find({ aggregateGuid }, { sort: { _id: -1 } }).toArray();
    return latestEvent;
  }
}
