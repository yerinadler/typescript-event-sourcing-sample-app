import { TYPES } from '@constants/types';
import { IEventHandler } from '@core/IEventHandler';
import { BookEvent } from '@domain/book/events';
import { inject, injectable } from 'inversify';
import Event from 'events';
import { BookCreated } from '@domain/book/events/BookCreated';

@injectable()
export class FakeNotificationEventHandler implements IEventHandler<BookEvent> {
  constructor(
    @inject(TYPES.EventBus) private readonly eventBus: Event.EventEmitter,
  ) {}

  async handle() {
    this.eventBus.on(BookCreated.name, async (event) => {
      console.log('Book info to be notified', event);
    });
  }
}