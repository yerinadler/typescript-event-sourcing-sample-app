import { ICommandBus, IQueryBus } from '@cqrs-es/core';
import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpGet, httpPost, httpPut, request, response } from 'inversify-express-utils';

import { BASE_TYPES } from '@common/types';
import { CreateJobCommand } from '@src/job/application/commands/definitions/create-job';
import { UpdateJobCommand } from '@src/job/application/commands/definitions/update-job';
import { GetAllJobsQuery } from '@src/job/application/queries/definitions/get-all-jobs-query';

import { ok } from '../processors/response';

@controller('/api/v1/jobs')
export class JobController {
  constructor(
    @inject(BASE_TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(BASE_TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  @httpPost('')
  async createJob(@request() req: Request, @response() res: Response) {
    const { title, description } = req.body;
    const result = await this._commandBus.send(new CreateJobCommand(title, description));
    return res.json(ok('Created job successfully', result));
  }

  @httpPut('/:id')
  async updateJob(@request() req: Request, @response() res: Response) {
    const { title, description, version } = req.body;
    await this._commandBus.send(new UpdateJobCommand(req.params.id, title, description, version));
    return res.json(ok('Updated the job successfully', undefined));
  }

  @httpGet('')
  async getAllJobs(@request() req: Request, @response() res: Response) {
    const jobs = await this._queryBus.execute(new GetAllJobsQuery());
    return res.json(ok('Get all jobs successfully', jobs));
  }
}
