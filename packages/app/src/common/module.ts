import { IEventBus, IEventStore, IQuery, IQueryBus, ICommandBus } from '@cqrs-es/core';
import { AsyncContainerModule, interfaces } from 'inversify';
import { Redis } from 'ioredis';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { Db } from 'mongodb';

import config from '@config/main';
import { JobEventStore } from '@src/job/infrastructure/event-store/job-event-store';

import { CommandBus } from './infrastructure/commandBus';
import { createMongodbConnection } from './infrastructure/db/mongodb';
import { KafkaEventBus } from './infrastructure/eventbus/kafka';
import { ApplicationEventStore } from './infrastructure/eventstore/application-event-store';
import { QueryBus } from './infrastructure/query-bus';
import { getRedisClient } from './infrastructure/redis';
import { SUBSRIPTION_TOPICS, BASE_TYPES, EVENT_STREAM_NAMES } from './types';

export const commonContainerModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  // Module Registration
  const db: Db = await createMongodbConnection(config.MONGODB_URI);
  const kafka = new Kafka({ brokers: config.KAFKA_BROKER_LIST.split(',') });
  const kafkaProducer = kafka.producer();
  const kafkaConsumer = kafka.consumer({ groupId: config.KAFKA_CONSUMER_GROUP_ID });

  await kafkaProducer.connect();
  await kafkaConsumer.connect();

  for (const topic of SUBSRIPTION_TOPICS) {
    await kafkaConsumer.subscribe({ topic });
  }

  bind<Producer>(BASE_TYPES.KafkaProducer).toConstantValue(kafkaProducer);
  bind<Consumer>(BASE_TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);

  const redisSubscriber: Redis = getRedisClient();
  const redis: Redis = getRedisClient();

  bind<Redis>(BASE_TYPES.RedisSubscriber).toConstantValue(redisSubscriber);
  bind<Redis>(BASE_TYPES.Redis).toConstantValue(redis);
  bind<IEventBus>(BASE_TYPES.EventBus).to(KafkaEventBus);
  bind<Db>(BASE_TYPES.Db).toConstantValue(db);
  bind<IEventStore>(BASE_TYPES.EventStore).to(ApplicationEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Application);
  bind<IEventStore>(BASE_TYPES.EventStore).to(JobEventStore).whenTargetNamed(EVENT_STREAM_NAMES.Job);
  bind<ICommandBus>(BASE_TYPES.CommandBus).toConstantValue(new CommandBus());
  bind<IQueryBus<IQuery>>(BASE_TYPES.QueryBus).toConstantValue(new QueryBus());
});
