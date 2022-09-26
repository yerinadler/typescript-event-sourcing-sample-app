import { IEventBus, IEventStore, EventStore } from '@cqrs-es/core';
import { inject, injectable } from 'inversify';
import { Db } from 'mongodb';

import { Application } from '@domain/application';
import { TYPES } from '@src/types';

@injectable()
export class ApplicationEventStore extends EventStore implements IEventStore<Application> {
  constructor(@inject(TYPES.Db) private readonly db: Db, @inject(TYPES.EventBus) private readonly eventBus: IEventBus) {
    super(db.collection('application-events'), eventBus);
  }
}
