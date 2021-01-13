import 'module-alias/register';
import * as dotenv from 'dotenv';
dotenv.config();

import 'reflect-metadata';
import { initialise } from './entrypoint';
import { TYPES } from '@constants/types';
import { IEvent } from '@core/IEvent';
import { EventHandler } from '@infrastructure/eventHandler';

(async () => {
  const container = await initialise();
  const baseEventHandler = container.get<EventHandler>(TYPES.EventHandler);
  baseEventHandler.initialise();
})();

