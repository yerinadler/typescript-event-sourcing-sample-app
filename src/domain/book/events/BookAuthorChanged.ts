import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class BookAuthorChanged extends Event implements IEvent {
  constructor(public guid: string, public authorId: string) {
    super(BookAuthorChanged.name);
  }
}
