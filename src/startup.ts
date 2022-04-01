import '@interfaces/http/controllers';

import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { AuthorReadModelFacade, IAuthorReadModelFacade } from '@application/projection/author/ReadModel';
import { BookReadModelFacade, IBookReadModelFacade } from '@application/projection/book/ReadModel';
import { CreateBookCommandHandler } from '@commandHandlers/book/CreateBookCommandHandler';
import { MarkBookAsBorrowedCommandHandler } from '@commandHandlers/book/MarkBookAsBorrowedCommandHandler';
import { UpdateBookAuthorCommandHandler } from '@commandHandlers/book/UpdateBookAuthorCommandHandler';
import { CreateLoanCommandHandler } from '@commandHandlers/loan/CreateLoanCommandHandler';
import { CreateUserCommandHandler } from '@commandHandlers/user/CreateUserCommandHandler';
import config from '@config/main';
import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { Command } from '@core/Command';
import { ICommandHandler } from '@core/ICommandHandler';
import { IEventBus } from '@core/IEventBus';
import { IEventHandler } from '@core/IEventHandler';
import { IEventStore } from '@core/IEventStore';
import { BookAuthorChanged } from '@domain/book/events/BookAuthorChanged';
import { BookBorrowed } from '@domain/book/events/BookBorrowed';
import { BookCreated } from '@domain/book/events/BookCreated';
import { IBookRepository } from '@domain/book/IBookRepository';
import { LoanCreated } from '@domain/loan/events/LoanCreated';
import { ILoanRepository } from '@domain/loan/ILoanRepository';
import { UserCreated } from '@domain/user/events/UserCreated';
import { IUserRepository } from '@domain/user/IUserRepository';
import { AuthorCreatedEventHandler } from '@eventHandlers/author/AuthorCreatedEventHandler';
import { BookAuthorChangedEventHandler } from '@eventHandlers/book/BookAuthorChangedEventHandler';
import { BookBorrowedEventHandler } from '@eventHandlers/book/BookBorrowedEventHandler';
import { BookCreatedEventHandler } from '@eventHandlers/book/BookCreatedEventHandler';
import { FakeNotificationEventHandler } from '@eventHandlers/book/FakeNotificationEventHandler';
import { LoanCreatedEventHandler } from '@eventHandlers/loan/LoanCreatedEventHandler';
import { UserCreatedEventHandler } from '@eventHandlers/user/UserCreatedEventHandler';
import { CommandBus } from '@infrastructure/commandBus';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { RedisEventBus } from '@infrastructure/eventbus/redis';
import { BookEventStore } from '@infrastructure/eventstore/BookEventStore';
import { LoanEventStore } from '@infrastructure/eventstore/LoanEventStore';
import { UserEventStore } from '@infrastructure/eventstore/UserEventStore';
import { getRedisClient } from '@infrastructure/redis';
import { BookRepository } from '@infrastructure/repositories/BookRepository';
import { LoanRepository } from '@infrastructure/repositories/LoanRepository';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { errorHandler } from '@interfaces/http/middlewares/ErrorHandler';

const initialise = async () => {
  const container = new Container();

  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);

  // Initialise Redis
  const redisSubscriber: Redis = getRedisClient();
  const redis: Redis = getRedisClient();
  await redisSubscriber.subscribe(['book', 'user', 'loan']);

  container.bind<Redis>(TYPES.RedisSubscriber).toConstantValue(redisSubscriber);
  container.bind<Redis>(TYPES.Redis).toConstantValue(redis);
  container.bind<IEventBus>(TYPES.EventBus).to(RedisEventBus);

  // Read models for query
  container.bind<IBookReadModelFacade>(TYPES.BookReadModelFacade).to(BookReadModelFacade);
  container.bind<IAuthorReadModelFacade>(TYPES.AuthorReadModelFacade).to(AuthorReadModelFacade);

  // Event Handlers
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(FakeNotificationEventHandler);
  container.bind<IEventHandler<BookAuthorChanged>>(TYPES.Event).to(BookAuthorChangedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(UserCreatedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(AuthorCreatedEventHandler);
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(BookCreatedEventHandler);
  container.bind<IEventHandler<BookBorrowed>>(TYPES.Event).to(BookBorrowedEventHandler);

  // Prepare persistence components
  container.bind<Db>(TYPES.Db).toConstantValue(db);
  container.bind<IEventStore>(TYPES.EventStore).to(BookEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Book);
  container.bind<IEventStore>(TYPES.EventStore).to(UserEventStore).whenTargetNamed(EVENT_STREAM_NAMES.User);
  container.bind<IEventStore>(TYPES.EventStore).to(LoanEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Loan);
  container.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
  container.bind<ILoanRepository>(TYPES.LoanRepository).to(LoanRepository);

  // Register command handlers
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateBookCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookAuthorCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateUserCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateLoanCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(MarkBookAsBorrowedCommandHandler);

  // Create command bus
  const commandBus = new CommandBus();

  // Register all the command handler here
  container.getAll<ICommandHandler<Command>[]>(TYPES.CommandHandler).forEach((handler: any) => {
    commandBus.registerHandler(handler.constructor.commandToHandle, handler);
  });

  container.bind<CommandBus>(TYPES.CommandBus).toConstantValue(commandBus);

  // Event Handlers that depend on CommandBus
  container.bind<IEventHandler<LoanCreated>>(TYPES.Event).to(LoanCreatedEventHandler);

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
