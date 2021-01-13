import { Message } from "./IMessage";

export interface IEvent extends Message {
  eventType?: string;
  version?: number;
}