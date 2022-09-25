import '@src/api/http/controllers';

import { ICommand, IQuery, ICommandHandler, ICommandBus, IQueryBus, IQueryHandler, IEventHandler } from '@cqrs-es/core';
import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import config from '@config/main';
import { errorHandler } from '@src/api/http/middlewares/error-handler';

import { TYPES } from '@src/types';
import { infrastructureModule } from './infrastructure/module';
import { CreateApplicationCommandHandler } from '@src/application/commands/handlers/create-application-handler';
import { ApplicationCreatedEventHandler } from '@src/application/events/handlers/application-created-handler';
import { GetAllApplicationsQueryHandler } from '@src/application/queries/handlers/get-all-applications-query-handler';
import { IApplicationRepository } from '@domain/application-repository.interface';
import { ApplicationCreated } from '@domain/events/application-created';
import { ApplicationRepository } from '@infrastructure/repositories/application-repository';

const initialise = async () => {
  const container = new Container();

  await container.loadAsync(infrastructureModule);
  
  container.bind<IEventHandler<ApplicationCreated>>(TYPES.Event).to(ApplicationCreatedEventHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateApplicationCommandHandler);
  container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllApplicationsQueryHandler);

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
