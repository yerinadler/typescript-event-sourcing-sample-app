import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookBorrowed extends Event implements IEvent {
  constructor(public guid: string) {
    super(BookBorrowed.name);
  }
}
