import { IEvent } from '@core/IEvent';
import { Event } from '@core/Event';

export class BookAuthorChanged extends Event implements IEvent {
  constructor(
    public guid: string,
    public authorId: string,
  ) {
    super(BookAuthorChanged.name);
  }
}