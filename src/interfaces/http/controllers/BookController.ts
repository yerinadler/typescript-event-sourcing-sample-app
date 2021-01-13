import { Request, Response } from 'express';
import {
  controller,
  httpGet,
  request,
  response,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { TYPES } from '@constants/types';
import { ok } from '../processors/response';
import { CommandBus } from '@infrastructure/commandBus';
import { CreateBookCommand } from '@commands/book/CreateBook';
import { UpdateBookAuthorCommand } from '@commands/book/UpdateBookAuthor';
import { NotFoundException } from '@core/ApplicationError';
import { UpdateBookCommand } from '@commands/book/UpdateBook';
import { IReadModelFacade } from '@domain/book/ReadModel';

@controller('/api/v1/books')
export class BookController {
  constructor(
    @inject(TYPES.CommandBus) private readonly commandBus: CommandBus,
    @inject(TYPES.ReadModelFacade) private readonly readmodel: IReadModelFacade,
  ) {}

  @httpGet('/')
  async getAllBooks(@request() req: Request, @response() res: Response) {
    const books = await this.readmodel.getAllBooks();
    return res.json(ok('Successfully retrieved all books', books));

  }

  @httpGet('/:guid')
  async getBookByGuid(@request() req: Request, @response() res: Response) {
    const book = await this.readmodel.getBookById(req.params.guid);
    return res.json(ok('Successfully retrieve the book', book));
  }

  @httpPost('/')
  async createBook(@request() req: Request, @response() res: Response) {
    const { name, author, price } = req.body;
    
    const command = new CreateBookCommand(name, author, price);
    await this.commandBus.send(command);

    return res.json(ok('Successfully created the book', undefined));
  }

  @httpPut('/:guid/author')
  async updateAuthor(@request() req: Request, @response() res: Response) {
    const { author, version } = req.body;
    const command = new UpdateBookAuthorCommand(req.params.guid, author, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }

  @httpPut('/:guid')
  async updateBook(@request() req: Request, @response() res: Response) {
    const { name, author, price, version } = req.body;
    const command = new UpdateBookCommand(req.params.guid, name, author, price, version);
    await this.commandBus.send(command);
    return res.json(ok('Successfully updated the book', undefined));
  }
}
