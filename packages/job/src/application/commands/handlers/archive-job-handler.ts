import { ICommandHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { inject, injectable } from 'inversify';

import { IJobRepository } from '@src/domain/job-repository.interface';

import { ArchiveJobCommand } from '../definitions/archive-job';

@injectable()
export class ArchiveJobCommandHandler implements ICommandHandler<ArchiveJobCommand> {
  commandToHandle: string = ArchiveJobCommand.name;

  constructor(@inject(TYPES.JobRepository) private readonly _repository: IJobRepository) {}

  async handle(command: ArchiveJobCommand): Promise<void> {
    const job = await this._repository.getById(command.guid);
    job.archive();
    await this._repository.save(job, command.originalVersion);
  }
}
