export interface ICommandHandler<TCommand> {
  handle(command: TCommand): any;
}
