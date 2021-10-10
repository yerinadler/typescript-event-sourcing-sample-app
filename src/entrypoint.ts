import Events from 'events';

import '@interfaces/http/controllers';
import { urlencoded } from 'body-parser';
import { Application, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import { Redis } from 'ioredis';
import { Db } from 'mongodb';

import { CreateBookCommandHandler } from '@commandHandlers/book/CreateBookCommandHandler';
import { UpdateBookAuthorCommandHandler } from '@commandHandlers/book/UpdateBookAuthorCommandHandler';
import { CreateUserCommandHandler } from '@commandHandlers/user/CreateUserCommandHandler';
import config from '@config/main';
import { NAMES, TYPES } from '@constants/types';
import { Command } from '@core/Command';
import { ICommandHandler } from '@core/ICommandHandler';
import { IEventHandler } from '@core/IEventHandler';
import { IEventStore } from '@core/IEventStore';
import { BookEvent } from '@domain/book/events';
import { IBookRepository } from '@domain/book/IBookRepository';
import { UserEvent } from '@domain/user/events';
import { IUserRepository } from '@domain/user/IUserRepository';
import { AuthorCreatedEventHandler } from '@eventHandlers/author/AuthorCreatedEventHandler';
import { BookAuthorChangedEventHandler } from '@eventHandlers/book/BookAuthorChangedEventHandler';
import { BookCreatedEventHandler } from '@eventHandlers/book/BookCreatedEventHandler';
import { FakeNotificationEventHandler } from '@eventHandlers/book/FakeNotificationEventHandler';
import { UserCreatedEventHandler } from '@eventHandlers/user/UserCreatedEventHandler';
import { CommandBus } from '@infrastructure/commandBus';
import { createMongodbConnection } from '@infrastructure/db/mongodb';
import { getEventBus } from '@infrastructure/eventbus/EventBus';
import { EventHandler } from '@infrastructure/eventHandler';
import { EventStore } from '@infrastructure/eventstore';
import RedisClient from '@infrastructure/redis';
import { BookRepository } from '@infrastructure/repositories/BookRepository';
import { UserRepository } from '@infrastructure/repositories/UserRepository';
import { errorHandler } from '@interfaces/http/middlewares/ErrorHandler';
import { AuthorReadModelFacade, IAuthorReadModelFacade } from '@projection/author/ReadModel';
import { BookReadModelFacade, IBookReadModelFacade } from '@projection/book/ReadModel';

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

  container.bind<Redis>(TYPES.Redis).toConstantValue(RedisClient);
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
      urlencoded({
        extended: true,
      })
    );
    app.use(json());
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
