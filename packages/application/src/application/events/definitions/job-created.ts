import { Event } from '@cqrs-es/core';


export class JobCreated extends Event {
  eventName = JobCreated.name;
  aggregateName = 'job';

  constructor(public guid: string, public title: string) {
    super(guid);
  }
}
