import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';

import { BASE_TYPES } from '@common/types';
import { IEventBus } from '@cqrs-es/core/IEventBus';

import { initialise } from './startup';

(async () => {
  const container = await initialise();
  const baseEventHandler = container.get<IEventBus>(BASE_TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
