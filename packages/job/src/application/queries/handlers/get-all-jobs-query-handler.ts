import { IQueryHandler } from '@cqrs-es/core';
import { TYPES } from '@src/types';
import { Client } from 'cassandra-driver';
import { inject, injectable } from 'inversify';

import { JobStatus } from '@src/domain/status';

import { GetAllJobsQuery } from '../definitions/get-all-jobs-query';
import { JobQueryResponseModel } from '../definitions/job-response';

interface JobRow {
  id: string;
  title: string;
  description: string;
  status: string;
  version: number;
}

@injectable()
export class GetAllJobsQueryHandler implements IQueryHandler<GetAllJobsQuery, JobQueryResponseModel[]> {
  queryToHandle = GetAllJobsQuery.name;

  constructor(@inject(TYPES.CassandraDb) private readonly _cassandraClient: Client) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(_: GetAllJobsQuery) {
    const query = 'SELECT guid, title, description, status, version FROM jobs';
    const queryResult = await this._cassandraClient.execute(query);
    const resp: JobQueryResponseModel[] = queryResult.rows.map((row) => ({
      id: row['guid'] as string,
      title: row['title'] as string,
      description: row['description'] as string,
      status: row['status'] as JobStatus,
      version: row['version'] as number,
    }));
    return resp;
  }
}
