import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { TYPES } from '@src/types';
import { ICommandBus } from '@cqrs-es/core';
import { IQueryBus } from '@cqrs-es/core';
import { CreateApplicationCommand } from '@src/application/commands/definitions/create-application';
import { GetAllApplicationsQuery } from '@src/application/queries/definitions/get-all-applications-query';

import { ok } from '../processors/response';

@controller('/api/v1/applications')
export class ApplicationController {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  @httpPost('')
  async createApplication(@request() req: Request, @response() res: Response) {
    const { jobId, firstname, lastname, email, currentPosition } = req.body;
    const result = await this._commandBus.send(
      new CreateApplicationCommand(jobId, firstname, lastname, email, currentPosition)
    );
    return res.json(ok('Created a new application successfully', result));
  }

  @httpGet('')
  async getAllApplications(@request() req: Request, @response() res: Response) {
    const query: GetAllApplicationsQuery = new GetAllApplicationsQuery();
    const result = await this._queryBus.execute(query);
    return res.json(ok('Retrieved all applications successfully', result));
  }
}
