import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Job } from '@domain/job/job';
import { IJobRepository } from '@domain/job/job-repository.interface';

import { Repository } from '../../../infrastructure/repositories/repository';

@injectable()
export class JobRepository extends Repository<Job> implements IJobRepository {
  constructor(@inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Job) private readonly eventstore: IEventStore) {
    super(eventstore, Job);
  }
}
