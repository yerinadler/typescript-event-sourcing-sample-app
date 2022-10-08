import { Event } from '@cqrs-es/core';

import { JobStatus } from '../status';

export class JobArchived extends Event {
  public eventName = JobArchived.name;
  public aggregateName = 'job';
  public status: JobStatus = JobStatus.ARCHIVED;

  constructor(public guid: string) {
    super(guid);
  }
}
