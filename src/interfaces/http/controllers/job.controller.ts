import { ICommandBus } from '@ayerin/ddd-base';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import { BASE_TYPES } from '@common/types';
import { CreateJobCommand } from '@src/job/application/commands/definitions/create-job';

import { ok } from '../processors/response';

@controller('/api/v1/jobs')
export class JobController {
  constructor(@inject(BASE_TYPES.CommandBus) private readonly _commandBus: ICommandBus) {}

  @httpPost('')
  async createJob(@request() req: Request, @response() res: Response) {
    const { title, description } = req.body;
    const result = await this._commandBus.send(new CreateJobCommand(title, description));
    return res.json(ok('Created job successfully', result));
  }
}
