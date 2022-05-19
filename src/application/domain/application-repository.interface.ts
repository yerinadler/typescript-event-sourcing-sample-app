import { IEventSourcedRepository } from '@ayerin/ddd-base';

import { Application } from './application';

export interface IApplicationRepository extends IEventSourcedRepository<Application> {}
