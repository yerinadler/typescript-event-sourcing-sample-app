import { instanceToPlain, plainToInstance } from 'class-transformer';
import { EVENT_METADATA, EVENT_METADATA_TYPES } from './Event';
import { injectable, unmanaged } from 'inversify';
import { Collection } from 'mongodb';

import { ConcurrencyException, NotFoundException } from './Errors';
import { EventDescriptor } from './EventDescriptor';
import { IEvent } from './interfaces/IEvent';
import { IEventBus } from './interfaces/IEventBus';
import { IEventStore } from './interfaces/IEventStore';

export type StorageEvent = Omit<IEvent, EVENT_METADATA_TYPES>;
export class RehydratedEvent {}

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
      const eventDescriptor = this.createEventDescriptor(event);
      this._eventBus.publish(event.aggregateName, event);
      operations.push({ insertOne: eventDescriptor });
    }

    await this.eventCollection.bulkWrite(operations);
  }

  async getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]> {
    const events = await this.eventCollection.find({ aggregateGuid }).toArray();
    if (!events.length) {
      throw new NotFoundException('Aggregate with the requested Guid does not exist');
    }
    return events.map((eventDescriptor: EventDescriptor) => this.rehydrateEventFromStorage(eventDescriptor));
  }

  private async getLastEventDescriptor(aggregateGuid: string) {
    const [latestEvent] = await this.eventCollection.find({ aggregateGuid }, { sort: { _id: -1 } }).toArray();
    return latestEvent;
  }

  private createEventDescriptor<T extends IEvent = IEvent>(
    event: T
  ): EventDescriptor {
    const JSONEvent = instanceToPlain(event);

    for (const attribute of EVENT_METADATA) {
      delete JSONEvent[attribute];
    }

    return new EventDescriptor(event.aggregateId, event.aggregateName, event.eventName, JSONEvent, event.version!);
  }

  private rehydrateEventFromStorage(storageEvent: EventDescriptor): IEvent {
    const event: any = plainToInstance(RehydratedEvent, storageEvent);
    return {
      aggregateId: storageEvent.aggregateGuid,
      aggregateName: storageEvent.aggregateName,
      eventName: storageEvent.eventName,
      version: storageEvent.version,
      ...event.payload,
    }
  }
}