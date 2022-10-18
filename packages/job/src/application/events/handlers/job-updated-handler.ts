import { IEventHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { Client } from 'cassandra-driver';
import { inject, injectable } from 'inversify';

import { JobUpdated } from '@src/domain/events/job-updated';

@injectable()
export class JobUpdatedEventHandler implements IEventHandler<JobUpdated> {
  public event = JobUpdated.name;

  constructor(@inject(TYPES.CassandraDb) private readonly _cassandraClient: Client) {}

  async handle(event: JobUpdated) {
    const query = 'UPDATE jobs SET title = ?, description = ?, status = ?, version = ? WHERE guid = ?';

    await this._cassandraClient.execute(
      query,
      [event.title, event.description, event.status, event.version, event.guid],
      { prepare: true }
    );
  }
}
