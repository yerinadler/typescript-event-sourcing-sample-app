export const TYPES = {
  // Dependencies
  Db: Symbol('Db'),
  Redis: Symbol('Redis'),
  EventPublisher: Symbol('EventPublisher'),
  EventSubscriber: Symbol('EventPSubscriber'),

  // Repositories
  BookRepository: Symbol('BookRepository'),
  UserRepository: Symbol('UserRepository'),

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
};
