import { IQueryHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { Client } from 'cassandra-driver';
import { inject, injectable } from 'inversify';

import { GetAllJobsQuery } from '../definitions/get-all-jobs-query';

@injectable()
export class GetAllJobsQueryHandler implements IQueryHandler<GetAllJobsQuery, any> {
  queryToHandle = GetAllJobsQuery.name;

  constructor(@inject(TYPES.CassandraDb) private readonly _cassandraClient: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_: GetAllJobsQuery) {
    const query = 'SELECT * FROM jobs';
    const { rows: jobs } = await this._cassandraClient.execute(query);
    return jobs;
  }
}
