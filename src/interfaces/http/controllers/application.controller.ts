import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, request, response } from 'inversify-express-utils';

import { CreateApplicationCommand } from '@application/commands/application/definitions/create-application';
import { GetAllApplicationsQuery } from '@application/queries/application/definitions/get-all-applications-query';
import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/ICommandBus';
import { IQueryBus } from '@core/IQueryBus';

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
