import { AggregateRoot } from './AggregateRoot';
import { injectable, unmanaged } from 'inversify';
import { IRepository } from './interfaces/IRepository';
import { IEventStore } from './interfaces/IEventStore';

@injectable()
export class EventSourcedRepository<T extends AggregateRoot> implements IRepository<T> {
  constructor(
    @unmanaged() private readonly eventStore: IEventStore,
    @unmanaged() private readonly Type: { new (): T }
  ) {}

  async save(aggregateRoot: T, expectedVersion: number) {
    await this.eventStore.saveEvents(aggregateRoot.guid, aggregateRoot.getUncommittedEvents(), expectedVersion);
    aggregateRoot.markChangesAsCommitted();
  }

  async getById(guid: string) {
    const aggregateRoot = new this.Type() as T;
    const history = await this.eventStore.getEventsForAggregate(guid);
    aggregateRoot.loadFromHistory(history);
    return aggregateRoot;
  }
}
