import { Command } from "@cqrs-es/core";

export class CreateApplicationCommand extends Command {
  public jobId: string;
  public firstname: string;
  public lastname: string;
  public email: string;
  public currentPosition: string;

  constructor(
    jobId: string,
    firstname: string,
    lastname: string,
    email: string,
    currentPosition: string,
    guid?: string
  ) {
    super(guid);
    this.jobId = jobId;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.currentPosition = currentPosition;
  }
}
