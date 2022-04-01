import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookAuthorChanged extends Event implements IEvent {
  eventName = BookAuthorChanged.name;
  aggregateName = 'book';

  constructor(public guid: string, public authorId: string) {
    super();
  }
}
