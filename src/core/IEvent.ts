import { IMessage } from './IMessage';

export interface IEvent extends IMessage {
  eventType?: string;
  version?: number;
}
