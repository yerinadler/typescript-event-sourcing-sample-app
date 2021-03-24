import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookEvent } from '@domain/book/events';
import { inject, injectable } from 'inversify';
import Event from 'events';
import Redis from 'ioredis';
import { BookCreated } from '@domain/book/events/BookCreated';
import { IBookReadModelFacade } from '../../projection/book/ReadModel';
import { IAuthorReadModelFacade } from 'projection/author/ReadModel';

@injectable()
export class BookCreatedEventHandler implements IEventHandler<BookEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis.Redis,
    @inject(TYPES.BookReadModelFacade) private readonly readModel: IBookReadModelFacade,
    @inject(TYPES.AuthorReadModelFacade) private readonly authorReadModel: IAuthorReadModelFacade,
  ) {}

  async handle() {
    this.eventBus.on(BookCreated.name, async (event) => {
      event.author = await this.authorReadModel.getById(event.authorId);
      this.redisClient.set(`books:${event.guid}`, JSON.stringify({
        name: event.name,
        author: event.author,
        price: event.price,
        version: event.version,
      }));
    });
  }
}