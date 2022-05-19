import { IEventStore } from '@ayerin/ddd-base';
import { inject, injectable, named } from 'inversify';

import { EVENT_STREAM_NAMES, BASE_TYPES } from '@common/types';
import { Repository } from '@src/common/infrastructure/repositories/repository';

import { Application } from '../../domain/application';
import { IApplicationRepository } from '../../domain/application-repository.interface';

@injectable()
export class ApplicationRepository extends Repository<Application> implements IApplicationRepository {
  constructor(
    @inject(BASE_TYPES.EventStore) @named(EVENT_STREAM_NAMES.Application) private readonly eventstore: IEventStore
  ) {
    super(eventstore, Application);
  }
}
