import { AggregateRoot, ApplicationError } from '@cqrs-es/core';
import { BAD_REQUEST } from 'http-status-codes';

import { JobArchived } from './events/job-archived';
import { JobCreated } from './events/job-created';
import { JobUpdated } from './events/job-updated';
import { JobStatus } from './status';

export class Job extends AggregateRoot {
  private title: string;
  private description: string;
  private status: JobStatus = JobStatus.ACTIVE;

  constructor();

  constructor(guid: string, title: string, description: string);

  constructor(guid?: string, title?: string, description?: string) {
    super(guid);

    if (guid && title && description) {
      this.applyChange(new JobCreated(guid, title, description, this.status));
    }
  }

  updateInfo(title: string, description: string) {
    this.applyChange(new JobUpdated(this.guid, title, description, this.status));
  }

  archive() {
    if (this.status === JobStatus.ARCHIVED) {
      throw new ApplicationError(BAD_REQUEST, '5310', 'The job is already archived');
    }
    this.applyChange(new JobArchived(this.guid));
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyJobArchived(event: JobArchived) {
    this.status = JobStatus.ARCHIVED;
  }
}
