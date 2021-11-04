import { Command } from '@core/Command';

export class CreateUserCommand extends Command {
  public email: string;
  public firstname: string;
  public lastname: string;
  public dateOfBirth: Date;

  constructor(email: string, firstname: string, lastname: string, dateOfBirth: Date, guid?: string) {
    super(guid);
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.dateOfBirth = dateOfBirth;
  }
}
