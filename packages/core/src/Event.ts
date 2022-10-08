import { IEvent } from './interfaces/IEvent';

export type EVENT_METADATA_TYPES = 'eventName' | 'aggregateName' | 'aggregateId' | 'version';

export const EVENT_METADATA = ['eventName', 'aggregateName', 'aggregateId', 'version'];

export abstract class Event implements IEvent {
  public abstract eventName: string;
  public abstract aggregateName: string;
  public aggregateId: string;
  public version: number;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
  }
}