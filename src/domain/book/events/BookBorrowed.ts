import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookBorrowed extends Event implements IEvent {
  eventName = BookBorrowed.name;
  aggregateName = 'book';

  constructor(public guid: string) {
    super();
  }
}
