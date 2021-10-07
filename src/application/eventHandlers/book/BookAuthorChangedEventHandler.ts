import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { inject, injectable } from 'inversify';
import { BookAuthorChanged } from '@domain/book/events/BookAuthorChanged';
import { Redis } from 'ioredis';
import { IAuthorReadModelFacade } from 'projection/author/ReadModel';

@injectable()
export class BookAuthorChangedEventHandler implements IEventHandler<BookAuthorChanged> {

  public event: string = BookAuthorChanged.name

  constructor(
    @inject(TYPES.Redis) private readonly redisClient: Redis,
    @inject(TYPES.AuthorReadModelFacade) private authorReadModel: IAuthorReadModelFacade,
  ) {}

  async handle(message: string) {
    const event = JSON.parse(message);
    const cachedBook = await this.redisClient.get(`books:${event.guid}`);
    if (cachedBook) {
      const book = JSON.parse(cachedBook);
      event.author = await this.authorReadModel.getById(event.authorId);
      await this.redisClient.set(`books:${event.guid}`, JSON.stringify({
        ...book,
        author: event.author,
        version: event.version,
      }));
    }
  }
}