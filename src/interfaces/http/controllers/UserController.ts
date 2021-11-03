import { Request, Response } from 'express';
import { inject } from 'inversify';
import { controller, httpPost, request, response } from 'inversify-express-utils';

import { CreateUserCommand } from '@commands/user/CreateUser';
import { TYPES } from '@constants/types';
import { CommandBus } from '@infrastructure/commandBus';

import { ok } from '../processors/response';

@controller('/api/v1/users')
export class UserController {
  constructor(@inject(TYPES.CommandBus) private readonly commandBus: CommandBus) {}

  @httpPost('')
  async createUser(@request() req: Request, @response() res: Response) {
    const { email, firstname, lastname, dateOfBirth } = req.body;
    const command = new CreateUserCommand(email, firstname, lastname, new Date(dateOfBirth));
    await this.commandBus.send(command);
    return res.json(ok('Successfully created the user', undefined));
  }
}
