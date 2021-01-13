import { injectable } from 'inversify';
import { ICommandHandler } from '@core/ICommandHandler';
import { CreateBookCommand } from '../../commands/book/CreateBook';
import { Book } from '@domain/book/Book';
import Events from 'events';
import { IRepository } from '@core/IRepository';

@injectable()
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {
  
  constructor(
    private readonly repository: IRepository<Book>,
  ) {}
  
  async handle(command: CreateBookCommand) {
    const book = new Book(command.guid, command.name, command.author, command.price);
    this.repository.save(book, -1);
  }
}