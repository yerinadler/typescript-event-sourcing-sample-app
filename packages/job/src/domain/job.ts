import { AggregateRoot } from '@cqrs-es/core';

import { JobCreated } from './events/job-created';
import { JobUpdated } from './events/job-updated';

export class Job extends AggregateRoot {
  private title: string;
  private description: string;

  constructor();

  constructor(guid: string, title: string, description: string);

  constructor(guid?: string, title?: string, description?: string) {
    super(guid);

    if (guid && title && description) {
      this.applyChange(new JobCreated(guid, title, description));
    }
  }

  updateInfo(title: string, description: string) {
    this.applyChange(new JobUpdated(this.guid, title, description));
  }

  applyJobCreated(event: JobCreated) {
    this.guid = event.guid;
    this.title = event.title;
    this.description = event.description;
  }

  applyJobUpdated(event: JobUpdated) {
    this.title = event.title;
    this.description = event.description;
  }
}
