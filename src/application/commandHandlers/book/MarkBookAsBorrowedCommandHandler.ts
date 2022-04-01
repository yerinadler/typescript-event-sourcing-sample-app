import { inject, injectable } from 'inversify';

import { MarkBookAsBorrowedCommand } from '@commands/book/MarkBookAsBorrowed';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { Book } from '@domain/book/Book';
import { IBookRepository } from '@domain/book/IBookRepository';

@injectable()
export class MarkBookAsBorrowedCommandHandler implements ICommandHandler<MarkBookAsBorrowedCommand> {
  public static commandToHandle: string = MarkBookAsBorrowedCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: MarkBookAsBorrowedCommand) {
    const book: Book = await this.repository.getById(command.guid);
    book.markAsBorrowed();
    await this.repository.save(book, book.version);
  }
}
