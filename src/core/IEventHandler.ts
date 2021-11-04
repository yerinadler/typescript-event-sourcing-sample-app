import { IEvent } from './IEvent';

// TODO: Revise typing
export interface IEventHandler<T extends IEvent> {
  event: string;
  handle(message: string): void;
}
