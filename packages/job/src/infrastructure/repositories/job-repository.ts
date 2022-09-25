import { inject, injectable, named } from 'inversify';

import { TYPES } from '@src/types';
import { EventSourcedRepository, IEventStore } from '@cqrs-es/core';
import { Job } from '@src/domain/job';
import { IJobRepository } from '@src/domain/job-repository.interface';

@injectable()
export class JobRepository extends EventSourcedRepository<Job> implements IJobRepository {
  constructor(@inject(TYPES.JobEventStore) private readonly eventstore: IEventStore) {
    super(eventstore, Job);
  }
}
