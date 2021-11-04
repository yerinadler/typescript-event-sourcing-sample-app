import { inject, injectable } from 'inversify';

import { UpdateBookAuthorCommand } from '@commands/book/UpdateBookAuthor';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { IBookRepository } from '@domain/book/IBookRepository';

@injectable()
export class UpdateBookAuthorCommandHandler implements ICommandHandler<UpdateBookAuthorCommand> {
  public static commandToHandle: string = UpdateBookAuthorCommand.name;

  constructor(@inject(TYPES.BookRepository) private readonly repository: IBookRepository) {}

  async handle(command: UpdateBookAuthorCommand) {
    const book = await this.repository.getById(command.guid);
    book.changeAuthor(command.authorId);
    await this.repository.save(book, command.originalVersion);
  }
}
