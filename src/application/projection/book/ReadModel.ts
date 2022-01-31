import { inject, injectable } from 'inversify';
import Redis from 'ioredis';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/ApplicationError';
import { IReadModelFacade } from '@core/IReadModelFacade';

export class BookListDTO {
  constructor(
    public readonly name: string,
    public readonly author: string,
    public readonly isBorrowed: boolean,
    public readonly price: number,
    public readonly version: number
  ) {}
}

export interface IBookReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class BookReadModelFacade implements IBookReadModelFacade {
  constructor(@inject(TYPES.Redis) private readonly redisClient: Redis.Redis) {}

  async getAll() {
    const books = [];
    const keys = await this.redisClient.keys('books:*');

    for (const key of keys) {
      const result = await this.redisClient.get(key);
      if (result) {
        books.push({ guid: key.replace('books:', ''), ...JSON.parse(result) });
      }
    }

    return books;
  }

  async getById(guid: string) {
    const book = await this.redisClient.get(`books:${guid}`);
    if (!book) {
      throw new NotFoundException('The requested book does not exist');
    }
    return JSON.parse(book);
  }

  async getAuthorById(authorId: string) {
    const author = await this.redisClient.get(`authors:${authorId}`);
    if (!author) {
      throw new NotFoundException('The requested author does not exist');
    }
    return JSON.parse(author);
  }
}
