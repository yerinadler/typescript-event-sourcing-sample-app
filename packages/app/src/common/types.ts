export const BASE_TYPES = {
  // Dependencies
  Db: Symbol('Db'),
  KafkaProducer: Symbol('KafkaProducer'),
  KafkaConsumer: Symbol('KafkaConsumer'),
  RedisSubscriber: Symbol('RedisSubscriber'),
  Redis: Symbol('Redis'),
  EventBus: Symbol('EventBus'),
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
};

export const EVENT_STREAM_NAMES = {
  Job: Symbol('Job'),
  Application: Symbol('Application'),
};

export const SUBSRIPTION_TOPICS = ['job', 'application'];
