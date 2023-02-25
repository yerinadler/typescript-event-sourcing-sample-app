import * as dotenv from 'dotenv';
import { Application } from 'express';
dotenv.config();

import 'reflect-metadata';

import { initialise } from '../startup';
import config from '@config/main';
import { TYPES } from '../types';
import { Producer } from 'kafkajs';

(async () => {
  const container = await initialise();
  const api: Application = container.get<Application>(TYPES.ApiServer);
  
  const kafkaProducer = container.get<Producer>(TYPES.KafkaProducer);
  kafkaProducer.connect();

  api.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );
})();
