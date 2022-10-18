import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { initialise } from './startup';
import { TYPES } from './types';

// eslint-disable-next-line import/order
import { IEventBus } from '@cqrs-es/core';

(async () => {
  const container = await initialise();

  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
