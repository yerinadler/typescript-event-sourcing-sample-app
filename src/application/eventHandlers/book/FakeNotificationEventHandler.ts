import { IEventHandler } from '@core/IEventHandler';
import { injectable } from 'inversify';
import { BookCreated } from '@domain/book/events/BookCreated';

@injectable()
export class FakeNotificationEventHandler implements IEventHandler<BookCreated> {

  public event: string = BookCreated.name;

  async handle(message: string) {
    console.log('Book info to be notified', message);
  }
}