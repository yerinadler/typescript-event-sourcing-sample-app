import { ICommandHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';

import { Job } from '@src/domain/job';
import { IJobRepository } from '@src/domain/job-repository.interface';

import { CreateJobCommand } from '../definitions/create-job';

@injectable()
export class CreateJobCommandHandler implements ICommandHandler<CreateJobCommand> {
  commandToHandle: string = CreateJobCommand.name;

  constructor(@inject(TYPES.JobRepository) private readonly _repository: IJobRepository) {}

  async handle(command: CreateJobCommand): Promise<{ guid: string }> {
    const job: Job = new Job(command.guid, command.title, command.description);
    await this._repository.save(job, -1);
    return { guid: command.guid };
  }
}
