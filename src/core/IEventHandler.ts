import { IEvent } from './IEvent';

export interface IEventHandler<T extends IEvent> {
  event: string;
  handle(event: T): void;
}
