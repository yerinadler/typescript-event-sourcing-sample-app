import { controller, httpGet, request, response } from 'inversify-express-utils';
import { Request, Response } from 'express';
import { ok } from '../processors/response';

@controller('')
export class CommonController {
  @httpGet('/healthz')
  async healthcheck(@request() req: Request, @response() res: Response) {
    return res.json(ok('Success', undefined));
  }
}