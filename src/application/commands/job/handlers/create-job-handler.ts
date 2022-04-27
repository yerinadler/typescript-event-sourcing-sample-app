import { inject, injectable } from 'inversify';

import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { Job } from '@domain/job/job';
import { IJobRepository } from '@domain/job/job-repository.interface';

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
