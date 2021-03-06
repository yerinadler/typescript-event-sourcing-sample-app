import { IEvent } from '@core/IEvent';
import { Event } from '@core/Event';

export class BookCreated extends Event implements IEvent {
  constructor(
    public guid: string,
    public name: string,
    public authorId: string,
    public price: number
  ) {
    super(BookCreated.name);
  }
}