import { AggregateRoot } from './AggregateRoot';

export interface IRepository<T> {
  save(aggregateRoot: T, expectedVersion: number): void;
  getById(guid: string): Promise<T>; 
}