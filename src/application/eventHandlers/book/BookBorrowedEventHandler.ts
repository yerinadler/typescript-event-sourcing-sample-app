import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { IAuthorReadModelFacade } from '@application/projection/author/ReadModel';
import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookBorrowed } from '@domain/book/events/BookBorrowed';

@injectable()
export class BookBorrowedEventHandler implements IEventHandler<BookBorrowed> {
  public event = BookBorrowed.name;

  constructor(
    @inject(TYPES.Redis) private readonly redisClient: Redis,
    @inject(TYPES.AuthorReadModelFacade) private authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle(event: BookBorrowed) {
    console.log(`Book with the ID of ${event.guid} is now borrowed`);
    const cachedBook = await this.redisClient.get(`books:${event.guid}`);
    if (cachedBook) {
      const book = JSON.parse(cachedBook);
      await this.redisClient.set(
        `books:${event.guid}`,
        JSON.stringify({
          ...book,
          isBorrowed: true,
          version: event.version,
        })
      );
    }
  }
}
