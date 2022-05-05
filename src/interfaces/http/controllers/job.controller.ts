import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/ICommandBus';
import { CreateJobCommand } from 'job/application/commands/definitions/create-job';

import { ok } from '../processors/response';

@controller('/api/v1/jobs')
export class JobController {
  constructor(@inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus) {}

  @httpPost('')
  async createJob(@request() req: Request, @response() res: Response) {
    const { title, description } = req.body;
    const result = await this._commandBus.send(new CreateJobCommand(title, description));
    return res.json(ok('Created job successfully', result));
  }
}
