import { IEvent } from './IEvent';

export interface IEventBus {
  publish(channel: string, event: IEvent): Promise<void>;
  subscribeEvents(): Promise<void>;
}
