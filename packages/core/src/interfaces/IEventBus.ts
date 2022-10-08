import { EventDescriptor } from 'EventDescriptor';
import { IEvent } from './IEvent';

export interface IEventBus {
  publish(channel: string, event: EventDescriptor): Promise<void>;
  subscribeEvents(): Promise<void>;
}
