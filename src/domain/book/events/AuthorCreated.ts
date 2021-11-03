import _ from 'fs';

import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';
import { UserCreated } from '@domain/user/events/UserCreated';

export class AuthorCreated extends Event implements IEvent {
  constructor(public guid: string, public name: string, public author: string, public price: number) {
    super(UserCreated.name);
  }
}
