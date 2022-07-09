import { AggregateRoot } from '@core/AggregateRoot';

import { JobCreated } from './events/job-created';

export class Job extends AggregateRoot {
  private title: string;
  private description: string;

  constructor();

  constructor(guid: string, title: string, description: string);

  constructor(guid?: string, title?: string, description?: string) {
    super();
    if (guid && title && description) {
      this.applyChange(new JobCreated(guid, title, description));
    }
  }

  applyJobCreated(event: JobCreated) {
    this.title = event.title;
    this.description = event.description;
  }
}
