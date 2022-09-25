import { ICommandBus, IEventBus, IQuery, IQueryBus } from "@cqrs-es/core";
import { TYPES } from "@src/types";
import { AsyncContainerModule, interfaces } from "inversify";
import { createMongodbConnection } from "./db/mongodb";
import { ApplicationEventStore } from "./eventstore/application-event-store";
import config from '@config/main';
import { Db } from "mongodb";
import { Consumer, Kafka, Producer } from "kafkajs";
import { KafkaEventBus } from "./eventbus/kafka";
import { CommandBus } from "./commandBus";
import { QueryBus } from "./query-bus";
import { IApplicationEventStore } from "@src/domain/application-event-store.interface";
import { IApplicationRepository } from "@src/domain/application-repository.interface";
import { ApplicationRepository } from "./repositories/application-repository";
import RedisClient, { Redis } from "ioredis";

export const infrastructureModule = new AsyncContainerModule(async (bind: interfaces.Bind) => {
  const db: Db = await createMongodbConnection(config.MONGODB_URI);
  
  const kafka = new Kafka({ brokers: config.KAFKA_BROKER_LIST.split(',') });
  const kafkaProducer = kafka.producer();
  const kafkaConsumer = kafka.consumer({ groupId: config.KAFKA_CONSUMER_GROUP_ID });
  await kafkaProducer.connect();
  await kafkaConsumer.connect();

  for (const topic of config.KAFKA_TOPICS_TO_SUBSCRIBE.split(',')) {
    await kafkaConsumer.subscribe({ topic });
  }

  bind<Db>(TYPES.Db).toConstantValue(db);
  bind<Producer>(TYPES.KafkaProducer).toConstantValue(kafkaProducer);
  bind<Consumer>(TYPES.KafkaConsumer).toConstantValue(kafkaConsumer);
  bind<Redis>(TYPES.Redis).toConstantValue(new RedisClient());
  bind<IEventBus>(TYPES.EventBus).to(KafkaEventBus);
  bind<IApplicationEventStore>(TYPES.ApplicationEventStore).to(ApplicationEventStore).inSingletonScope();
  bind<IApplicationRepository>(TYPES.ApplicationRepository).to(ApplicationRepository).inSingletonScope();
  bind<ICommandBus>(TYPES.CommandBus).toConstantValue(new CommandBus());
  bind<IQueryBus<IQuery>>(TYPES.QueryBus).toConstantValue(new QueryBus());
});