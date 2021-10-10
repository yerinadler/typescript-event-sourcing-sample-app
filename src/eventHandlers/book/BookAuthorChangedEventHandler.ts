import Event from 'events';

import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookEvent } from '@domain/book/events';
import { BookAuthorChanged } from '@domain/book/events/BookAuthorChanged';
import { IAuthorReadModelFacade } from 'projection/author/ReadModel';

@injectable()
export class BookAuthorChangedEventHandler implements IEventHandler<BookEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis,
    @inject(TYPES.AuthorReadModelFacade) private authorReadModel: IAuthorReadModelFacade
  ) {}

  async handle() {
    this.eventBus.on(BookAuthorChanged.name, async (event) => {
      const cachedBook = await this.redisClient.get(`books:${event.guid}`);
      if (cachedBook) {
        const book = JSON.parse(cachedBook);
        event.author = await this.authorReadModel.getById(event.authorId);
        await this.redisClient.set(
          `books:${event.guid}`,
          JSON.stringify({
            ...book,
            author: event.author,
            version: event.version,
          })
        );
      }
    });
  }
}
