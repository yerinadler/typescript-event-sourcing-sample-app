import { ICommandHandler } from './ICommandHandler';

export interface ICommandBus {
  registerHandler<TCommand>(commandName: string, handler: ICommandHandler<TCommand>): void;
  send<TCommand>(command: TCommand): void;
}
