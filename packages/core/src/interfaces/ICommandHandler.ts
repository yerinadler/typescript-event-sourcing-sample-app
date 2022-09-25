import { ICommand } from './ICommand';

export interface ICommandHandler<TCommand extends ICommand = any> {
  commandToHandle: string;
  handle(command: TCommand): any;
}
