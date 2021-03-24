import { injectable } from 'inversify';
import { ICommandHandler } from '@core/ICommandHandler';
import { Book } from '@domain/book/Book';
import { UpdateBookAuthorCommand } from '../../commands/book/UpdateBookAuthor';
import { IRepository } from '@core/IRepository';

@injectable()
export class UpdateBookAuthorCommandHandler implements ICommandHandler<UpdateBookAuthorCommand> {
  
  constructor(
    private readonly repository: IRepository<Book>,
  ) {}
  
  async handle(command: UpdateBookAuthorCommand) {
    const book = await this.repository.getById(command.guid);
    book.changeAuthor(command.authorId);
    await this.repository.save(book, command.originalVersion);
  }
}