import { CreateUserCommand } from '@commands/user/CreateUser';
import { ICommandHandler } from '@core/ICommandHandler';
import { IRepository } from '@core/IRepository';
import { User } from '@domain/user/User';

export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly repository: IRepository<User>
  ) {}

  async handle(command: CreateUserCommand) {
    const user = new User(command.guid, command.email, command.firstname, command.lastname, command.dateOfBirth);
    this.repository.save(user, -1);
  }
}