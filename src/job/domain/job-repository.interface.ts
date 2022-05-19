import { IEventSourcedRepository } from '@ayerin/ddd-base';

import { Job } from './job';

export interface IJobRepository extends IEventSourcedRepository<Job> {}
