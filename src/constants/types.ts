export const TYPES = {
  // Dependencies
  Db: Symbol('Db'),
  RedisSubscriber: Symbol('RedisSubscriber'),
  Redis: Symbol('Redis'),
  EventBus: Symbol('EventBus'),

  // Repositories
  BookRepository: Symbol('BookRepository'),
  UserRepository: Symbol('UserRepository'),
  LoanRepository: Symbol('LoanRepository'),

  // Data Mappers
  BookDataMapper: Symbol('BookDataMapper'),

  // Application Services
  BookApplication: Symbol('BookApplication'),

  // Read Model Facade (for book)
  BookReadModelFacade: Symbol('BookReadModelFacade'),
  AuthorReadModelFacade: Symbol('AuthorReadModelFacade'),

  // Command Bus
  CommandBus: Symbol('CommandBus'),

  // Command Handlers
  CommandHandler: Symbol('CommandHandler'),

  // Event
  Event: Symbol('Event'),
  EventHandler: Symbol('EventHandler'),
  EventStore: Symbol('EventStore'),

  // Event Handlers
  BookCreatedEventHandler: Symbol('BookCreatedEventHandler'),
};

export const NAMES = {
  // Event Store
  BookEventStore: Symbol('BookEventStore'),
  UserEventStore: Symbol('UserEventStore'),
  LoanEventStore: Symbol('LoanEventStore'),
};
