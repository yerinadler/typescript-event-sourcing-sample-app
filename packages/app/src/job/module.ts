import { ICommand, ICommandHandler, IEventHandler, IQuery, IQueryHandler } from '@cqrs-es/core';
import { ContainerModule, interfaces } from 'inversify';

import { BASE_TYPES } from '@common/types';

import { CreateJobCommandHandler } from './application/commands/handlers/create-job-handler';
import { UpdateJobCommandHandler } from './application/commands/handlers/update-job-handler';
import { JobCreatedEventHandler } from './application/events/handlers/job-created-handler';
import { JobUpdatedEventHandler } from './application/events/handlers/job-updated-handler';
import { GetAllJobsQueryHandler } from './application/queries/handlers/get-all-jobs-query-handler';
import { JobCreated } from './domain/events/job-created';
import { JobUpdated } from './domain/events/job-updated';
import { IJobRepository } from './domain/job-repository.interface';
import { JobRepository } from './infrastructure/repositories/job-repository';
import { TYPES } from './types';

export const jobContainerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEventHandler<JobCreated>>(BASE_TYPES.Event).to(JobCreatedEventHandler);
  bind<IEventHandler<JobUpdated>>(BASE_TYPES.Event).to(JobUpdatedEventHandler);
  bind<ICommandHandler<ICommand>>(BASE_TYPES.CommandHandler).to(CreateJobCommandHandler);
  bind<ICommandHandler<ICommand>>(BASE_TYPES.CommandHandler).to(UpdateJobCommandHandler);
  bind<IQueryHandler<IQuery>>(BASE_TYPES.QueryHandler).to(GetAllJobsQueryHandler);
  bind<IJobRepository>(TYPES.JobRepository).to(JobRepository);
});
