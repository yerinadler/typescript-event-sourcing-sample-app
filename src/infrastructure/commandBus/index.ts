import { injectable } from 'inversify';

import { ICommand } from '@core/ICommand';
import { ICommandHandler } from '@core/ICommandHandler';

@injectable()
export class CommandBus {
  public handlers: any = new Map();

  // TODO: Use class symbol and types instead of string in "send" method
  public registerHandler<TCommand>(commandName: string, handler: ICommandHandler<TCommand>) {
    if (this.handlers[commandName]) {
      return;
    }
    this.handlers.set(commandName, handler);
  }

  public async send(command: ICommand) {
    if (this.handlers.get(command.constructor.name)) {
      await this.handlers.get(command.constructor.name).handle(command);
    }
  }
}
