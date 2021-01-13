import { IRepository } from '@core/IRepository';
import { unmanaged, injectable, inject } from 'inversify';
import { Collection, Db } from 'mongodb';
import { IDataMapper } from '@core/IDataMapper';
import { TYPES } from '@constants/types';
import { AggregateRoot } from '@core/AggregateRoot';
import { Book } from '@domain/book/Book';
import { IEventStore } from '@core/IEventStore';

// @injectable()
// export class Repository<TDomainEntity>
// implements IRepository<TDomainEntity> {
//   private readonly collectionInstance: Collection;
//   private readonly dataMapper: IDataMapper<TDomainEntity>;

//   constructor(
//     @unmanaged() collectionInstance: Collection,
//     @unmanaged() dataMapper: IDataMapper<TDomainEntity>,
//   ) {
//     this.collectionInstance = collectionInstance;
//     this.dataMapper = dataMapper;
//   }

//   async findAll(): Promise<TDomainEntity[]> {
//     const dbResult = await this.collectionInstance.find({}).toArray();
//     return dbResult.map((result) => this.dataMapper.toDomain(result));
//   }

//   async findOneById(guid: string): Promise<TDomainEntity | null> {
//     const dbResult = await this.collectionInstance.findOne({ guid });
//     if (!dbResult) return null;
//     return this.dataMapper.toDomain(dbResult);
//   }

//   async doesExists(guid: string): Promise<boolean> {
//     const dbResult = await this.collectionInstance.findOne({ guid });
//     return !!dbResult;
//   }

//   async save(entity: TDomainEntity): Promise<void> {
//     const guid = (entity as any).guid;
//     const exists = await this.doesExists(guid);
//     if (!exists) {
//       await this.collectionInstance.insertOne(entity);
//       return;
//     }
//     await this.collectionInstance.replaceOne({ guid }, entity);
//   }

//   async delete(id: string): Promise<void> {
//     await this.collectionInstance.deleteOne({ guid: id });
//   }
// }

@injectable()
export class Repository<T extends AggregateRoot> implements IRepository<T> {
  
  // public eventCollection: Collection;
  
  constructor(
    private readonly eventStore: IEventStore,
    private readonly Type: { new (): T }
  ) {
    // this.eventCollection = this.dbClient.collection('book-events');
  }

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
