import { Event } from '@cqrs-es/core';

export class JobUpdated extends Event {
  eventName = JobUpdated.name;
  aggregateName = 'job';

  constructor(public guid: string, public title: string, public description: string) {
    super(guid);
  }
}
