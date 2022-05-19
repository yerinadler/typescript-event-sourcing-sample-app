import { IEventBus, IEventStore } from '@ayerin/ddd-base';
import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { BASE_TYPES } from '@common/types';

import { EventStore } from '.';

@injectable()
export class ApplicationEventStore extends EventStore implements IEventStore {
  constructor(
    @inject(BASE_TYPES.Db) private readonly db: Db,
    @inject(BASE_TYPES.EventBus) private readonly eventBus: IEventBus
  ) {
    super(db.collection('application-events'), eventBus);
  }
}
