import { inject, injectable } from 'inversify';
import { ICommandHandler } from '@core/ICommandHandler';
import { CreateBookCommand } from '@commands/book/CreateBook';
import { Book } from '@domain/book/Book';
import { TYPES } from '@constants/types';
import { IBookRepository } from '@domain/book/IBookRepository';

@injectable()
export class CreateBookCommandHandler implements ICommandHandler<CreateBookCommand> {

  public static commandToHandle: string = CreateBookCommand.name;
  
  constructor(
    @inject(TYPES.BookRepository) private readonly repository: IBookRepository,
  ) {}
  
  async handle(command: CreateBookCommand) {
    const book = new Book(command.guid, command.name, command.authorId, command.price);
    this.repository.save(book, -1);
  }
}