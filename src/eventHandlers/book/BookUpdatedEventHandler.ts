import { TYPES } from "@constants/types";
import { IEventHandler } from "@core/IEventHandler";
import { BookEvent } from "@domain/book/events";
import { inject, injectable } from "inversify";
import Event from "events";
import Redis from 'ioredis';
import { BookUpdated } from "@domain/book/events/BookUpdated";

@injectable()
export class BookUpdatedEventHandler implements IEventHandler<BookEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis.Redis,
  ) {}

  async handle() {
    this.eventBus.on(BookUpdated.name, async (event) => {
      const cachedBook = await this.redisClient.get(`books:${event.guid}`);
      if (cachedBook) {
        await this.redisClient.set(`books:${event.guid}`, JSON.stringify({
          name: event.name,
          author: event.author,
          price: event.price,
          version: event.version,
        }));
      }
    });
  }
}