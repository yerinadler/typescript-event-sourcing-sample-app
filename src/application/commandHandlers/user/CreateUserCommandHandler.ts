import { inject, injectable } from 'inversify';

import { CreateUserCommand } from '@commands/user/CreateUser';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { IUserRepository } from '@domain/user/IUserRepository';
import { User } from '@domain/user/User';

@injectable()
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  public static commandToHandle: string = CreateUserCommand.name;

  constructor(@inject(TYPES.UserRepository) private readonly repository: IUserRepository) {}

  async handle(command: CreateUserCommand) {
    const user = new User(command.guid, command.email, command.firstname, command.lastname, command.dateOfBirth);
    this.repository.save(user, -1);
  }
}
