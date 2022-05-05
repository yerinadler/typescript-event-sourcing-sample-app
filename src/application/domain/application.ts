import { AggregateRoot } from '@core/AggregateRoot';

import { ApplicationCreated } from './events/application-created';

export class Application extends AggregateRoot {
  private jobId: string;
  private firstname: string;
  private lastname: string;
  private email: string;
  private currentPosition: string;

  constructor();

  constructor(guid: string, jobId: string, firstname: string, lastname: string, email: string, currentPosition: string);

  constructor(
    guid?: string,
    jobId?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
    currentPosition?: string
  ) {
    super(guid);

    if (guid && jobId && firstname && lastname && email && currentPosition) {
      this.applyChange(new ApplicationCreated(this.guid, jobId, firstname, lastname, email, currentPosition));
    }
  }

  applyApplicationCreated(event: ApplicationCreated) {
    this.jobId = event.jobId;
    this.firstname = event.firstname;
    this.lastname = event.lastname;
    this.email = event.email;
    this.currentPosition = event.currentPosition;
  }
}
