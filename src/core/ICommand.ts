import { IMessage } from './IMessage';

export interface ICommand extends IMessage {
  guid: string;
}
