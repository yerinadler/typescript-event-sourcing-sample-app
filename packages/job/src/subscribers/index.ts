import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { initialise } from '../startup';
import { TYPES } from '../types';
import { IEventBus } from '@cqrs-es/core';
import config from '@config/main';
import { Consumer } from 'kafkajs';

(async () => {
  const container = await initialise();
  const kafkaConsumer = container.get<Consumer>(TYPES.KafkaConsumer);
  kafkaConsumer.connect();

  for (const topic of config.KAFKA_TOPICS_TO_SUBSCRIBE.split(',')) {
    await kafkaConsumer.subscribe({ topic });
  }
  
  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();

