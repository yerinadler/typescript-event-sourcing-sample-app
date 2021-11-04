import { inject, injectable } from 'inversify';
import { Redis } from 'ioredis';

import { TYPES } from '@constants/types';
import { NotFoundException } from '@core/ApplicationError';
import { IReadModelFacade } from '@core/IReadModelFacade';

export class AuthorDTO {
  constructor(public readonly guid: string, public readonly firstname: string, public readonly lastname: string) {}
}

export interface IAuthorReadModelFacade extends IReadModelFacade<any> {}

@injectable()
export class AuthorReadModelFacade implements IAuthorReadModelFacade {
  constructor(@inject(TYPES.Redis) private readonly redisClient: Redis) {}

  async getAll() {
    const authors = [];
    const keys = await this.redisClient.keys('authors:*');

    for (const key of keys) {
      const result = await this.redisClient.get(key);
      if (result) {
        authors.push({ guid: key.replace('authors:', ''), ...JSON.parse(result) });
      }
    }

    return authors;
  }

  async getById(guid: string) {
    const author = await this.redisClient.get(`authors:${guid}`);
    if (!author) {
      throw new NotFoundException('The requested author does not exist');
    }
    return JSON.parse(author);
  }
}
