import Event from 'events';

import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookEvent } from '@domain/book/events';
import { BookCreated } from '@domain/book/events/BookCreated';
import { IAuthorReadModelFacade } from 'projection/author/ReadModel';

import { IBookReadModelFacade } from '../../projection/book/ReadModel';

@injectable()
export class BookCreatedEventHandler implements IEventHandler<BookEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis,
    @inject(TYPES.BookReadModelFacade) private readonly readModel: IBookReadModelFacade,
    @inject(TYPES.AuthorReadModelFacade) private readonly authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle() {
    this.eventBus.on(BookCreated.name, async (event) => {
      event.author = await this.authorReadModel.getById(event.authorId);
      this.redisClient.set(
        `books:${event.guid}`,
        JSON.stringify({
          name: event.name,
          author: event.author,
          price: event.price,
          version: event.version,
        })
      );
    });
  }
}
