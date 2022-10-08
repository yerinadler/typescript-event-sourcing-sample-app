import { StorageEvent } from './EventStore';

export class EventDescriptor {
  constructor(
    public readonly aggregateGuid: string,
    public readonly aggregateName: string,
    public readonly eventName: string,
    public readonly payload: StorageEvent,
    public readonly version: number
  ) {}
}
