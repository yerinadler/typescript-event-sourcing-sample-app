import { IEvent } from '@core/IEvent';
import { Event } from '@core/Event';

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