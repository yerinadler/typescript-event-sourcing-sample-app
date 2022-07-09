import { ContainerModule, interfaces } from 'inversify';

import { BASE_TYPES } from '@common/types';
import { ICommand } from '@core/ICommand';
import { ICommandHandler } from '@core/ICommandHandler';
import { IEventHandler } from '@core/IEventHandler';

import { CreateJobCommandHandler } from './application/commands/handlers/create-job-handler';
import { JobCreatedEventHandler } from './application/events/handlers/job-created-handler';
import { JobCreated } from './domain/events/job-created';
import { IJobRepository } from './domain/job-repository.interface';
import { JobRepository } from './infrastructure/repositories/job-repository';
import { TYPES } from './types';

export const jobContainerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEventHandler<JobCreated>>(BASE_TYPES.Event).to(JobCreatedEventHandler);
  bind<ICommandHandler<ICommand>>(BASE_TYPES.CommandHandler).to(CreateJobCommandHandler);
  bind<IJobRepository>(TYPES.JobRepository).to(JobRepository);
});
