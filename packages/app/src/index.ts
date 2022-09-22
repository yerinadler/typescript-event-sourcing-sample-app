import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { BASE_TYPES } from './common/types';
import { initialise } from './startup';

// eslint-disable-next-line import/order
import { IEventBus } from '@cqrs-es/core';

(async () => {
  const container = await initialise();
  console.log(process.env.DB_NAME);
  const baseEventHandler = container.get<IEventBus>(BASE_TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
