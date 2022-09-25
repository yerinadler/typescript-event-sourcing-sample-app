import { IEvent } from "interfaces/IEvent";

export abstract class Event implements IEvent {
  public abstract eventName: string;
  public abstract aggregateName: string;
  public aggregateId: string;
  public version: number;

  constructor(aggregateId: string) {
    this.aggregateId = aggregateId;
  }
}
