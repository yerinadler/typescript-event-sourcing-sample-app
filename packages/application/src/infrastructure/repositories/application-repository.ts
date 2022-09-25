import { inject, injectable, named } from 'inversify';

import { TYPES } from '@src/types';
import { EventSourcedRepository } from '@cqrs-es/core';

import { Application } from '../../domain/application';
import { IApplicationRepository } from '../../domain/application-repository.interface';
import { IApplicationEventStore } from '@src/domain/application-event-store.interface';

@injectable()
export class ApplicationRepository extends EventSourcedRepository<Application> implements IApplicationRepository {
  constructor(
    @inject(TYPES.ApplicationEventStore) private readonly eventstore: IApplicationEventStore
  ) {
    super(eventstore, Application);
  }
}
