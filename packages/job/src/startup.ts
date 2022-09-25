import '@src/api/http/controllers';

import { ICommand, IQuery, ICommandHandler, ICommandBus, IQueryBus, IQueryHandler, IEventHandler } from '@cqrs-es/core';
import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import config from '@config/main';
import { errorHandler } from '@src/api/http/middlewares/error-handler';

import { TYPES } from '@src/types';
import { infrastructureModule } from './infrastructure/module';
import { CreateJobCommandHandler } from '@src/application/commands/handlers/create-job-handler';
import { UpdateJobCommandHandler } from '@src/application/commands/handlers/update-job-handler';
import { JobCreatedEventHandler } from '@src/application/events/handlers/job-created-handler';
import { JobUpdatedEventHandler } from '@src/application/events/handlers/job-updated-handler';
import { GetAllJobsQueryHandler } from '@src/application/queries/handlers/get-all-jobs-query-handler';
import { JobCreated } from '@domain/events/job-created';
import { JobUpdated } from '@domain/events/job-updated';

const initialise = async () => {
  const container = new Container();

  await container.loadAsync(infrastructureModule);

  container.bind<IEventHandler<JobCreated>>(TYPES.Event).to(JobCreatedEventHandler);
  container.bind<IEventHandler<JobUpdated>>(TYPES.Event).to(JobUpdatedEventHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateJobCommandHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(UpdateJobCommandHandler);
  container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllJobsQueryHandler);

  const commandBus = container.get<ICommandBus>(TYPES.CommandBus);
  
  container
    .getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler)
    .forEach((handler: ICommandHandler<ICommand>) => {
      commandBus.registerHandler(handler);
    });

  const queryBus = container.get<IQueryBus>(TYPES.QueryBus);
  container.getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler).forEach((handler: IQueryHandler<IQuery>) => {
    queryBus.registerHandler(handler);
  });

  const server = new InversifyExpressServer(container);

  server.setConfig((app: Application) => {
    app.use(urlencoded({ extended: true }));
    app.use(json());
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  apiServer.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );

  return container;
};

export { initialise };
