import { IEventHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { Client } from 'cassandra-driver';
import { inject, injectable } from 'inversify';

import { JobArchived } from '@src/domain/events/job-archived';

@injectable()
export class JobArchivedEventHandler implements IEventHandler<JobArchived> {
  public event = JobArchived.name;

  constructor(@inject(TYPES.CassandraDb) private readonly _cassandraClient: Client) {}

  async handle(event: JobArchived) {
    const query = 'UPDATE jobs SET status = ?, version = ? WHERE guid = ?';
    await this._cassandraClient.execute(query, [event.status, event.version, event.guid], { prepare: true });
  }
}
