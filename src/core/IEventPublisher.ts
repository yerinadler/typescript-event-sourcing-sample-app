import { IEvent } from './IEvent';

export interface IEventPublisher {
  publish(channel: string, event: IEvent): Promise<void>;
}
