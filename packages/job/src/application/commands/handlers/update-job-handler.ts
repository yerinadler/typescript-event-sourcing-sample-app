import { ICommandHandler } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';

import { IJobRepository } from '@src/domain/job-repository.interface';
import { TYPES } from '@src/types';

import { UpdateJobCommand } from '../definitions/update-job';

@injectable()
export class UpdateJobCommandHandler implements ICommandHandler<UpdateJobCommand> {
  commandToHandle: string = UpdateJobCommand.name;

  constructor(@inject(TYPES.JobRepository) private readonly _repository: IJobRepository) {}

  async handle(command: UpdateJobCommand): Promise<void> {
    const job = await this._repository.getById(command.guid);
    job.updateInfo(command.title, command.description);
    await this._repository.save(job, command.originalVersion);
  }
}
