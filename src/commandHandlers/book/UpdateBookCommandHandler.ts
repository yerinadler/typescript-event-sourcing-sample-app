import { inject, injectable } from 'inversify';
import { ICommandHandler } from '@core/ICommandHandler';
import { Book } from '@domain/book/Book';
import Events from 'events';
import { TYPES } from '@constants/types';
import { IRepository } from '@core/IRepository';
import { UpdateBookCommand } from '@commands/book/UpdateBook';

@injectable()
export class UpdateBookCommandHandler implements ICommandHandler<UpdateBookCommand> {
  
  constructor(
    private readonly repository: IRepository<Book>,
  ) {}
  
  async handle(command: UpdateBookCommand) {
    const book = await this.repository.getById(command.guid);
    book.update(command.name, command.author, command.price);
    await this.repository.save(book, command.originalVersion);
  }
}