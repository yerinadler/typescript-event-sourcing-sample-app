import { IEvent } from '@core/IEvent';
import { Event } from '@core/Event';
import { UserCreated } from '@domain/user/events/UserCreated';

export class AuthorCreated extends Event implements IEvent {
  constructor(
    public guid: string,
    public name: string,
    public author: string,
    public price: number
  ) {
    super(UserCreated.name);
  }
}