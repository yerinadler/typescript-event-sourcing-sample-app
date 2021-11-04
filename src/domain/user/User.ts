import { AggregateRoot } from '@core/AggregateRoot';

import { UserCreated } from './events/UserCreated';

export class User extends AggregateRoot {
  private _email: string;
  private _firstname: string;
  private _lastname: string;
  private _dateOfBirth: Date;

  get email() {
    return this._email;
  }

  get firstname() {
    return this._firstname;
  }

  get lastname() {
    return this._lastname;
  }

  get dateOfBirth() {
    return this._dateOfBirth;
  }

  constructor();

  constructor(guid: string, email: string, firstname: string, lastname: string, dateOfBirth: Date);

  constructor(guid?: string, email?: string, firstname?: string, lastname?: string, dateOfBirth?: Date) {
    super(guid);
    if (email && firstname && lastname && dateOfBirth) {
      this.applyChange(new UserCreated(this.guid, email, firstname, lastname, dateOfBirth));
    }
  }

  public applyUserCreated(event: UserCreated): void {
    this._email = event.email;
    this._firstname = event.firstname;
    this._lastname = event.lastname;
    this._dateOfBirth = event.dateOfBirth;
  }
}
