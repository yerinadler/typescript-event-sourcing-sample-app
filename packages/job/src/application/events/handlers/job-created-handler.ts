import { IEventHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { Logger } from 'winston';
import { Client } from 'cassandra-driver';
import { inject, injectable } from 'inversify';

import { JobCreated } from '@src/domain/events/job-created';

@injectable()
export class JobCreatedEventHandler implements IEventHandler<JobCreated> {
  public event = JobCreated.name;

  constructor(
    @inject(TYPES.CassandraDb) private readonly _cassandraClient: Client,
    @inject(TYPES.Logger) private readonly _logger: Logger,
  ) {}

  async handle(event: JobCreated) {
    const query = 'INSERT INTO jobs (guid, title, description, status, version) VALUES (?, ?, ?, ?, ?)';
    
    await this._cassandraClient.execute(
      query,
      [event.guid, event.title, event.description, event.status, event.version],
      { prepare: true }
    );

    this._logger.info(`created read model for job ${JSON.stringify(event)}`);
  }
}
