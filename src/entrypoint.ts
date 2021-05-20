import { Container } from 'inversify';
import { NAMES, TYPES } from '@constants/types';
import Events from 'events';
import { InversifyExpressServer } from 'inversify-express-utils';
import bodyParser from 'body-parser';
import config from '@config/main';

import '@interfaces/http/controllers';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { Db } from 'mongodb';
import Redis from 'ioredis';
import { errorHandler } from '@interfaces/http/middlewares/ErrorHandler';
import { Application } from 'express';
import { getEventBus } from '@infrastructure/eventbus/EventBus';
import { CommandBus } from '@infrastructure/commandBus';
import { CreateBookCommandHandler } from '@commandHandlers/book/CreateBookCommandHandler';
import { IEventStore } from '@core/IEventStore';
import { EventStore } from '@infrastructure/eventstore';
import { UpdateBookAuthorCommandHandler } from '@commandHandlers/book/UpdateBookAuthorCommandHandler';
import { BookCreatedEventHandler } from '@eventHandlers/book/BookCreatedEventHandler';
import { IEventHandler } from '@core/IEventHandler';
import { BookEvent } from '@domain/book/events';
import { EventHandler } from '@infrastructure/eventHandler';
import RedisClient from '@infrastructure/redis';
import { BookAuthorChangedEventHandler } from '@eventHandlers/book/BookAuthorChangedEventHandler';
import { FakeNotificationEventHandler } from '@eventHandlers/book/FakeNotificationEventHandler';
import { BookReadModelFacade, IBookReadModelFacade } from '@projection/book/ReadModel';
import { CreateUserCommandHandler } from '@commandHandlers/user/CreateUserCommandHandler';
import { UserEvent } from '@domain/user/events';
import { UserCreatedEventHandler } from '@eventHandlers/user/UserCreatedEventHandler';
import { AuthorCreatedEventHandler } from '@eventHandlers/author/AuthorCreatedEventHandler';
import { AuthorReadModelFacade, IAuthorReadModelFacade } from '@projection/author/ReadModel';
import { IBookRepository } from '@domain/book/IBookRepository';
import { BookRepository } from '@infrastructure/repositories/BookRepository';
import { Command } from '@core/Command';
import { ICommandHandler } from '@core/ICommandHandler';
import { IUserRepository } from '@domain/user/IUserRepository';
import { UserRepository } from '@infrastructure/repositories/UserRepository';

const initialise = async () => {
  const container = new Container();

  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);

  const eventbus: Events.EventEmitter = getEventBus();
  const bookEventStore: IEventStore = new EventStore(db.collection('book-events'), eventbus);
  const userEventStore: IEventStore = new EventStore(db.collection('user-events'), eventbus);

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

  container.getAll<ICommandHandler<Command>[]>(TYPES.CommandHandler).forEach((handler: any) => {
    commandBus.registerHandler(handler.constructor.commandToHandle, handler);
  });

  container.bind<CommandBus>(TYPES.CommandBus).toConstantValue(commandBus);
  
  container.bind<Redis.Redis>(TYPES.Redis).toConstantValue(RedisClient);
  container.bind<Events.EventEmitter>(TYPES.EventBus).toConstantValue(eventbus);
  container.bind<IBookReadModelFacade>(TYPES.BookReadModelFacade).to(BookReadModelFacade);
  container.bind<IAuthorReadModelFacade>(TYPES.AuthorReadModelFacade).to(AuthorReadModelFacade);
  container.bind<EventHandler>(TYPES.EventHandler).to(EventHandler);
  container.bind<IEventHandler<BookEvent>>(TYPES.Event).to(BookCreatedEventHandler);
  container.bind<IEventHandler<BookEvent>>(TYPES.Event).to(FakeNotificationEventHandler);
  container.bind<IEventHandler<BookEvent>>(TYPES.Event).to(BookAuthorChangedEventHandler);
  container.bind<IEventHandler<UserEvent>>(TYPES.Event).to(UserCreatedEventHandler);
  container.bind<IEventHandler<UserEvent>>(TYPES.Event).to(AuthorCreatedEventHandler);

  
  // API Server initialisation
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
