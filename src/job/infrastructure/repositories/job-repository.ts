import { IEventStore } from '@ayerin/ddd-base';
import { inject, injectable, named } from 'inversify';

import { BASE_TYPES, EVENT_STREAM_NAMES } from '@common/types';
import { Repository } from '@src/common/infrastructure/repositories/repository';
import { Job } from '@src/job/domain/job';
import { IJobRepository } from '@src/job/domain/job-repository.interface';

@injectable()
export class JobRepository extends Repository<Job> implements IJobRepository {
  constructor(@inject(BASE_TYPES.EventStore) @named(EVENT_STREAM_NAMES.Job) private readonly eventstore: IEventStore) {
    super(eventstore, Job);
  }
}
