import { ICommand } from '@cqrs-es/ICommand';
import { ICommandBus } from '@cqrs-es/ICommandBus';
import { ICommandHandler } from '@cqrs-es/ICommandHandler';
import { injectable } from 'inversify';

@injectable()
export class CommandBus<BaseCommand extends ICommand = ICommand> implements ICommandBus<BaseCommand> {
  public handlers: Map<string, ICommandHandler<BaseCommand>> = new Map();

  public registerHandler(handler: ICommandHandler<BaseCommand>) {
    const targetCommand: string = handler.commandToHandle;
    if (this.handlers.has(targetCommand)) {
      return;
    }
    this.handlers.set(targetCommand, handler);
  }

  public async send<T extends BaseCommand>(command: T) {
    if (this.handlers.has(command.constructor.name)) {
      return (this.handlers.get(command.constructor.name) as ICommandHandler<BaseCommand>).handle(command);
    }
  }
}
