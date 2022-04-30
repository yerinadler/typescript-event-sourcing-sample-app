export const TYPES = {
  // Dependencies
  Db: Symbol('Db'),
  KafkaProducer: Symbol('KafkaProducer'),
  KafkaConsumer: Symbol('KafkaConsumer'),
  RedisSubscriber: Symbol('RedisSubscriber'),
  Redis: Symbol('Redis'),
  EventBus: Symbol('EventBus'),

  ApplicationRepository: Symbol('ApplicationRepository'),
  JobRepository: Symbol('JobRepository'),

  // Command Bus
  CommandBus: Symbol('CommandBus'),

  // Query Bus
  QueryBus: Symbol('QueryBus'),

  // Command Handlers
  CommandHandler: Symbol('CommandHandler'),

  // Query Handlers
  QueryHandler: Symbol('QueryHandler'),

  // Event
  Event: Symbol('Event'),
  EventHandler: Symbol('EventHandler'),
  EventStore: Symbol('EventStore'),

  // Query Handlers
  GetAllApplicationsQueryHandler: Symbol('GetAllApplicationsQueryHandler'),
};

export const EVENT_STREAM_NAMES = {
  Job: Symbol('Job'),
  Application: Symbol('Application'),
};

export const SUBSRIPTION_TOPICS = ['job', 'application'];
