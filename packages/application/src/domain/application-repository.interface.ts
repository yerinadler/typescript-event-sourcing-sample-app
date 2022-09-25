import { IRepository } from '@cqrs-es/core';

import { Application } from './application';

export interface IApplicationRepository extends IRepository<Application> {}
