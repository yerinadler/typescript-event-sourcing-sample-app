import * as dotenv from 'dotenv';
import { Application } from 'express';
dotenv.config();

import 'reflect-metadata';

import { initialise } from '../startup';
import config from '@config/main';
import { TYPES } from '../types';

(async () => {
  const container = await initialise();
  const api: Application = container.get<Application>(TYPES.ApiServer);
  api.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );
})();
