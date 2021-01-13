import { TYPES } from "@constants/types";
import { IEventHandler } from "@core/IEventHandler";
import { BookEvent } from "@domain/book/events";
import { inject, injectable } from "inversify";
import Event from "events";
import Redis from 'ioredis';
import { BookCreated } from "@domain/book/events/BookCreated";

@injectable()
export class FakeNotificationEventHandler implements IEventHandler<BookEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
    @inject(TYPES.Redis) private readonly redisClient: Redis.Redis,
  ) {}

  async handle() {
    this.eventBus.on(BookCreated.name, async (event) => {
      console.log('Book info to be notified', event);
    });
  }
}