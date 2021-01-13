import { ICommand } from "@core/ICommand";
import { ICommandHandler } from "@core/ICommandHandler";
import { injectable } from "inversify";

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