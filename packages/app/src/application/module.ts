import { ICommand, ICommandHandler, IEventHandler, IQuery, IQueryHandler } from '@cqrs-es/core';
import { ContainerModule, interfaces } from 'inversify';

import { BASE_TYPES } from '@common/types';

import { CreateApplicationCommandHandler } from './application/commands/handlers/create-application-handler';
import { ApplicationCreatedEventHandler } from './application/events/handlers/application-created-handler';
import { GetAllApplicationsQueryHandler } from './application/queries/handlers/get-all-applications-query-handler';
import { IApplicationRepository } from './domain/application-repository.interface';
import { ApplicationCreated } from './domain/events/application-created';
import { ApplicationRepository } from './infrastructure/repositories/application-repository';
import { TYPES } from './types';

export const applicationContainerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<IEventHandler<ApplicationCreated>>(BASE_TYPES.Event).to(ApplicationCreatedEventHandler);
  bind<ICommandHandler<ICommand>>(BASE_TYPES.CommandHandler).to(CreateApplicationCommandHandler);
  bind<IApplicationRepository>(TYPES.ApplicationRepository).to(ApplicationRepository);
  bind<IQueryHandler<IQuery>>(BASE_TYPES.QueryHandler).to(GetAllApplicationsQueryHandler);
});
