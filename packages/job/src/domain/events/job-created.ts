import { Event } from '@cqrs-es/core';

import { JobStatus } from '../status';

export class JobCreated extends Event {
  eventName = JobCreated.name;
  aggregateName = 'job';

  constructor(public guid: string, public title: string, public description: string, public status: JobStatus) {
    super(guid);
  }
}
