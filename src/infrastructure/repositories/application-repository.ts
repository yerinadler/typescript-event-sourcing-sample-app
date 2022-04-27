import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { Application } from '@domain/application/application';
import { IApplicationRepository } from '@domain/application/application-repository.interface';

import { Repository } from './repository';

@injectable()
export class ApplicationRepository extends Repository<Application> implements IApplicationRepository {
  constructor(
    @inject(TYPES.EventStore) @named(EVENT_STREAM_NAMES.Application) private readonly eventstore: IEventStore
  ) {
    super(eventstore, Application);
  }
}
