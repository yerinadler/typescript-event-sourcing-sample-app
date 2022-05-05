import '@interfaces/http/controllers';
import { Application, urlencoded, json } from 'express';
import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import config from '@config/main';
import { errorHandler } from '@interfaces/http/middlewares/error-handler';
import { applicationContainerModule } from '@src/application/module';
import { commonContainerModule } from '@src/common/module';
import { jobContainerModule } from '@src/job/module';

const initialise = async () => {
  const container = new Container();

  await container.loadAsync(commonContainerModule);
  container.load(jobContainerModule);
  container.load(applicationContainerModule);

  const server = new InversifyExpressServer(container);

  server.setConfig((app: Application) => {
    app.use(urlencoded({ extended: true }));
    app.use(json());
  });

  server.setErrorConfig((app: Application) => {
    app.use(errorHandler);
  });

  const apiServer = server.build();
  apiServer.listen(config.API_PORT, () =>
    console.log('The application is initialised on the port %s', config.API_PORT)
  );

  return container;
};

export { initialise };
