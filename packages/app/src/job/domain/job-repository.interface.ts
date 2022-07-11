import { IRepository } from '@cqrs-es/core';

import { Job } from './job';

export interface IJobRepository extends IRepository<Job> {}
