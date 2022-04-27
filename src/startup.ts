import '@interfaces/http/controllers';

import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { CreateApplicationCommandHandler } from '@application/commands/application/handlers/create-application-handler';
import { CreateJobCommandHandler } from '@application/commands/job/handlers/create-job-handler';
import { ApplicationCreatedEventHandler } from '@application/events/application/handlers/application-created-handler';
import { JobCreatedEventHandler } from '@application/events/job/handlers/job-created-handler';
import { GetAllApplicationsQueryHandler } from '@application/queries/application/handlers/get-all-applications-query-handler';
import config from '@config/main';
import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { ICommand } from '@core/ICommand';
import { ICommandBus } from '@core/ICommandBus';
import { ICommandHandler } from '@core/ICommandHandler';
import { IEventBus } from '@core/IEventBus';
import { IEventHandler } from '@core/IEventHandler';
import { IEventStore } from '@core/IEventStore';
import { IQuery } from '@core/IQuery';
import { IQueryBus } from '@core/IQueryBus';
import { IQueryHandler } from '@core/IQueryHandler';
import { IApplicationRepository } from '@domain/application/application-repository.interface';
import { ApplicationCreated } from '@domain/application/events/application-created';
import { JobCreated } from '@domain/job/events/job-created';
import { IJobRepository } from '@domain/job/job-repository.interface';
import { CommandBus } from '@infrastructure/commandBus';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { RedisEventBus } from '@infrastructure/eventbus/redis';
import { ApplicationEventStore } from '@infrastructure/eventstore/application-event-store';
import { JobEventStore } from '@infrastructure/eventstore/job-event-store';
import { QueryBus } from '@infrastructure/query-bus';
import { getRedisClient } from '@infrastructure/redis';
import { ApplicationRepository } from '@infrastructure/repositories/application-repository';
import { JobRepository } from '@infrastructure/repositories/job-repository';
import { errorHandler } from '@interfaces/http/middlewares/error-handler';

const initialise = async () => {
  const container = new Container();

  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);

  // Initialise Redis
  const redisSubscriber: Redis = getRedisClient();
  const redis: Redis = getRedisClient();
  await redisSubscriber.subscribe(['job', 'application']);

  container.bind<Redis>(TYPES.RedisSubscriber).toConstantValue(redisSubscriber);
  container.bind<Redis>(TYPES.Redis).toConstantValue(redis);
  container.bind<IEventBus>(TYPES.EventBus).to(RedisEventBus);

  // Event Handlers
  container.bind<IEventHandler<JobCreated>>(TYPES.Event).to(JobCreatedEventHandler);
  container.bind<IEventHandler<ApplicationCreated>>(TYPES.Event).to(ApplicationCreatedEventHandler);

  // Prepare persistence components
  container.bind<Db>(TYPES.Db).toConstantValue(db);
  container
    .bind<IEventStore>(TYPES.EventStore)
    .to(ApplicationEventStore)
    .whenTargetNamed(EVENT_STREAM_NAMES.Application);
  container.bind<IEventStore>(TYPES.EventStore).to(JobEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Job);
  container.bind<IApplicationRepository>(TYPES.ApplicationRepository).to(ApplicationRepository);
  container.bind<IJobRepository>(TYPES.JobRepository).to(JobRepository);

  // Register command handlers
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateJobCommandHandler);
  container.bind<ICommandHandler<ICommand>>(TYPES.CommandHandler).to(CreateApplicationCommandHandler);

  // Create command bus
  const commandBus: ICommandBus<ICommand> = new CommandBus();

  // Register all command handlers
  container.getAll<ICommandHandler<ICommand>>(TYPES.CommandHandler).forEach((handler: ICommandHandler<ICommand>) => {
    commandBus.registerHandler(handler);
  });

  container.bind<ICommandBus<ICommand>>(TYPES.CommandBus).toConstantValue(commandBus);

  // Register query handlers
  container.bind<IQueryHandler<IQuery>>(TYPES.QueryHandler).to(GetAllApplicationsQueryHandler);

  // Create Query Bus
  const queryBus: IQueryBus<IQuery> = new QueryBus();

  // Register all query handlers
  container.getAll<IQueryHandler<IQuery>>(TYPES.QueryHandler).forEach((handler: IQueryHandler<IQuery>) => {
    queryBus.registerHandler(handler);
  });

  container.bind<IQueryBus<IQuery>>(TYPES.QueryBus).toConstantValue(queryBus);

  // Event Handlers that depend on CommandBus

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
