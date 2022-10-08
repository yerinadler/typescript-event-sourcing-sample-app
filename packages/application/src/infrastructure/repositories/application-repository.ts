import { EventSourcedRepository } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';

import { IApplicationEventStore } from '@src/domain/application-event-store.interface';
import { TYPES } from '@src/types';

import { Application } from '../../domain/application';
import { IApplicationRepository } from '../../domain/application-repository.interface';

@injectable()
export class ApplicationRepository extends EventSourcedRepository<Application> implements IApplicationRepository {
  constructor(@inject(TYPES.ApplicationEventStore) private readonly eventstore: IApplicationEventStore) {
    super(eventstore, Application);
  }
}
