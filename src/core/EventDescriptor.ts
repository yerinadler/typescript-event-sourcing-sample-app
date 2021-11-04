import { IEvent } from './IEvent';

export class EventDescriptor {
  constructor(
    public readonly aggregateGuid: string,
    public readonly eventPayload: IEvent,
    public readonly version: number
  ) {}
}
