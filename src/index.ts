import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { TYPES } from '@constants/types';
import { IEventBus } from '@core/IEventBus';

import { initialise } from './startup';

(async () => {
  const container = await initialise();
  const baseEventHandler = container.get<IEventBus>(TYPES.EventBus);
  baseEventHandler.subscribeEvents();
})();
