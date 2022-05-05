import { ICommand } from './ICommand';
import { ICommandHandler } from './ICommandHandler';

export interface ICommandBus<BaseCommand extends ICommand = ICommand> {
  registerHandler(handler: ICommandHandler<BaseCommand>): any;
  send<T extends BaseCommand>(command: T): any;
}
