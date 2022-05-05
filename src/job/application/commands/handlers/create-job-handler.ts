import { inject, injectable } from 'inversify';

import { ICommandHandler } from '@core/ICommandHandler';
import { Job } from '@src/job/domain/job';
import { IJobRepository } from '@src/job/domain/job-repository.interface';
import { TYPES } from '@src/job/types';

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
