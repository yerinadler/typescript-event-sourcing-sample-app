import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class UserCreated extends Event implements IEvent {
  constructor(
    public guid: string,
    public email: string,
    public firstname: string,
    public lastname: string,
    public dateOfBirth: Date
  ) {
    super(UserCreated.name);
  }
}
