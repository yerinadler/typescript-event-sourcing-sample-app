import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { TYPES } from './types';
import { initialise } from './startup';

// eslint-disable-next-line import/order
import { IEventBus } from '@cqrs-es/core';

(async () => {
  const container = await initialise();
  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
