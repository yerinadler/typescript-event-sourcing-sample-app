import { IMessage } from './IMessage';

export interface IEvent extends IMessage {
  eventName: string;
  aggregateName: string;
  version?: number;
}
