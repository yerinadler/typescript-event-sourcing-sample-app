import { IQuery } from './IQuery';
import { IQueryHandler } from './IQueryHandler';

export interface IQueryBus<BaseQuery extends IQuery = IQuery> {
  registerHandler(queryHandler: IQueryHandler<BaseQuery>): void;
  execute<T extends BaseQuery = BaseQuery, R = any>(query: T): Promise<R>;
}
