import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';
import { BookCreated } from '@domain/book/events/BookCreated';
import { IBookReadModelFacade } from '@application/projection/book/ReadModel';
import { IAuthorReadModelFacade } from '@application/projection/author/ReadModel';

@injectable()
export class BookCreatedEventHandler implements IEventHandler<BookCreated> {

  public event: string = BookCreated.name;

  constructor(
    @inject(TYPES.Redis) private readonly redisClient: Redis,
    @inject(TYPES.BookReadModelFacade) private readonly readModel: IBookReadModelFacade,
    @inject(TYPES.AuthorReadModelFacade) private readonly authorReadModel: IAuthorReadModelFacade,
  ) {}

  async handle(message: string) {
    const event = JSON.parse(message);
    event.author = await this.authorReadModel.getById(event.authorId);
    this.redisClient.set(`books:${event.guid}`, JSON.stringify({
      name: event.name,
      author: event.author,
      price: event.price,
      version: event.version,
    }));
  }
}