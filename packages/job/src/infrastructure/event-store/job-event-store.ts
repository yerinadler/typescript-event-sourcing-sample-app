import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { TYPES } from '@src/types';
import { EventStore, IEventBus } from '@cqrs-es/core';
import { IEventStore } from '@cqrs-es/core';
import { Job } from '@src/domain/job';
import { IJobEventStore } from '@src/domain/job-event-store.interface';

@injectable()
export class JobEventStore extends EventStore implements IJobEventStore {
  constructor(
    @inject(TYPES.Db) private readonly db: Db,
    @inject(TYPES.EventBus) private readonly eventBus: IEventBus
  ) {
    super(db.collection('job-events'), eventBus);
  }
}
