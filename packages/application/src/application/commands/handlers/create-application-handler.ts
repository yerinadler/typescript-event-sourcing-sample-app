import { ICommandHandler } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';

import { Application } from '@src/domain/application';
import { IApplicationRepository } from '@src/domain/application-repository.interface';
import { TYPES } from '@src/types';

import { CreateApplicationCommand } from '../definitions/create-application';

@injectable()
export class CreateApplicationCommandHandler implements ICommandHandler<CreateApplicationCommand> {
  commandToHandle: string = CreateApplicationCommand.name;

  constructor(@inject(TYPES.ApplicationRepository) private readonly _repository: IApplicationRepository) {}

  async handle(command: CreateApplicationCommand): Promise<{ guid: string }> {
    const application: Application = new Application(
      command.guid,
      command.jobId,
      command.firstname,
      command.lastname,
      command.email,
      command.currentPosition
    );
    await this._repository.save(application, -1);
    return { guid: command.guid };
  }
}
