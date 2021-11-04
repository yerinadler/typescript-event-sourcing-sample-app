import { IRepository } from '@core/IRepository';

import { Book } from './Book';

export interface IBookRepository extends IRepository<Book> {}
