import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { TYPES } from '@constants/types';
import { EventHandler } from '@infrastructure/eventHandler';

import { initialise } from './startup';

(async () => {
  const container = await initialise();
  const baseEventHandler = container.get<EventHandler>(TYPES.EventHandler);
  baseEventHandler.initialise();
})();
