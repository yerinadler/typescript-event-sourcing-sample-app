import { Container } from 'inversify';
import { NAMES, TYPES } from '@constants/types';
import { InversifyExpressServer } from 'inversify-express-utils';
import bodyParser from 'body-parser';
import config from '@config/main';

import '@interfaces/http/controllers';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { Db } from 'mongodb';
import Redis from 'ioredis';
import { errorHandler } from '@interfaces/http/middlewares/ErrorHandler';
import { Application } from 'express';
import { CommandBus } from '@infrastructure/commandBus';
import { CreateBookCommandHandler } from '@commandHandlers/book/CreateBookCommandHandler';
import { IEventStore } from '@core/IEventStore';
import { EventStore } from '@infrastructure/eventstore';
import { UpdateBookAuthorCommandHandler } from '@commandHandlers/book/UpdateBookAuthorCommandHandler';
import { BookCreatedEventHandler } from '@eventHandlers/book/BookCreatedEventHandler';
import { IEventHandler } from '@core/IEventHandler';
import { EventHandler } from '@infrastructure/eventHandler';
import { getRedisClient } from '@infrastructure/redis';
import { BookAuthorChangedEventHandler } from '@eventHandlers/book/BookAuthorChangedEventHandler';
import { FakeNotificationEventHandler } from '@eventHandlers/book/FakeNotificationEventHandler';
import { BookReadModelFacade, IBookReadModelFacade } from '@application/projection/book/ReadModel';
import { CreateUserCommandHandler } from '@commandHandlers/user/CreateUserCommandHandler';
import { UserCreatedEventHandler } from '@eventHandlers/user/UserCreatedEventHandler';
import { AuthorCreatedEventHandler } from '@eventHandlers/author/AuthorCreatedEventHandler';
import { AuthorReadModelFacade, IAuthorReadModelFacade } from '@application/projection/author/ReadModel';
import { IBookRepository } from '@domain/book/IBookRepository';
import { BookRepository } from '@infrastructure/repositories/BookRepository';
import { Command } from '@core/Command';
import { ICommandHandler } from '@core/ICommandHandler';
import { IUserRepository } from '@domain/user/IUserRepository';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { IEventPublisher } from '@core/IEventPublisher';
import { EventPublisher } from '@infrastructure/eventbus/EventPublisher';
import { BookAuthorChanged } from '@domain/book/events/BookAuthorChanged';
import { BookCreated } from '@domain/book/events/BookCreated';
import { UserCreated } from '@domain/user/events/UserCreated';
import { AuthorCreated } from '@domain/book/events/AuthorCreated';

const initialise = async () => {
  const container = new Container();

  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);
  
  // Initialise Redis as a primary event subscriber
  const eventSubscriber: Redis.Redis = getRedisClient();
  await eventSubscriber.subscribe([
    BookCreated.name,
    UserCreated.name,
    AuthorCreated.name,
    BookAuthorChanged.name,
  ]);

  container.bind<Redis.Redis>(TYPES.EventSubscriber).toConstantValue(eventSubscriber);
  container.bind<IEventPublisher>(TYPES.EventPublisher).to(EventPublisher);

  // Redis is also an event publisher here
  const eventPublisher = container.get<IEventPublisher>(TYPES.EventPublisher);
  const bookEventStore: IEventStore = new EventStore(db.collection('book-events'), eventPublisher);
  const userEventStore: IEventStore = new EventStore(db.collection('user-events'), eventPublisher);

  // Prepare persistence components
  container.bind<Db>(TYPES.Db).toConstantValue(db);
  container.bind<IEventStore>(TYPES.EventStore).toConstantValue(bookEventStore).whenTargetNamed(NAMES.BookEventStore);
  container.bind<IEventStore>(TYPES.EventStore).toConstantValue(userEventStore).whenTargetNamed(NAMES.UserEventStore);
  container.bind<IBookRepository>(TYPES.BookRepository).to(BookRepository);
  container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

  // Register command handlers
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateBookCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(UpdateBookAuthorCommandHandler);
  container.bind<ICommandHandler<Command>>(TYPES.CommandHandler).to(CreateUserCommandHandler);

  // Cretae command bus
  const commandBus = new CommandBus();

  // Register all the command handler here
  container.getAll<ICommandHandler<Command>[]>(TYPES.CommandHandler).forEach((handler: any) => {
    commandBus.registerHandler(handler.constructor.commandToHandle, handler);
  });
  container.bind<CommandBus>(TYPES.CommandBus).toConstantValue(commandBus);
  
  // Redis DB client (cache)
  container.bind<Redis.Redis>(TYPES.Redis).toConstantValue(getRedisClient());

  // Read models for query
  container.bind<IBookReadModelFacade>(TYPES.BookReadModelFacade).to(BookReadModelFacade);
  container.bind<IAuthorReadModelFacade>(TYPES.AuthorReadModelFacade).to(AuthorReadModelFacade);

  container.bind<EventHandler>(TYPES.EventHandler).to(EventHandler);
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(FakeNotificationEventHandler);
  container.bind<IEventHandler<BookAuthorChanged>>(TYPES.Event).to(BookAuthorChangedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(UserCreatedEventHandler);
  container.bind<IEventHandler<UserCreated>>(TYPES.Event).to(AuthorCreatedEventHandler);
  container.bind<IEventHandler<BookCreated>>(TYPES.Event).to(BookCreatedEventHandler);

  
  const server = new InversifyExpressServer(container);

  server.setConfig((app: Application) => {
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    app.use(bodyParser.json());
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  apiServer.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );
  // ======================================================
  return container;
};

export { initialise };
