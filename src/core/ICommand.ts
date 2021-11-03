import { Message } from './IMessage';

export interface ICommand extends Message {
  guid: string;
}
