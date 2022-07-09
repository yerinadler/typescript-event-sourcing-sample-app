import { IEvent } from './IEvent';

export interface IEventStore {
  saveEvents(aggregateGuid: string, eventHistory: IEvent[], version: number): void;
  getEventsForAggregate(aggregateGuid: string): Promise<IEvent[]>;
}
