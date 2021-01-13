import { TYPES } from "@constants/types";
import { NotFoundException } from "@core/ApplicationError";
import { inject, injectable } from "inversify";
import Redis from "ioredis";

export class BookListDTO {
  constructor(
    public readonly name: string,
    public readonly author: string,
    public readonly price: number,
    public readonly version: number,
  ) {}
}

export interface IReadModelFacade {
  getAllBooks(): Promise<BookListDTO[]>;
  getBookById(guid: string): Promise<BookListDTO>;
}

@injectable()
export class ReadModelFacade implements IReadModelFacade {

  constructor(
    @inject(TYPES.Redis) private readonly redisClient: Redis.Redis,
  ) {}

  async getAllBooks() {
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

  async getBookById(guid: string) {
    const book = await this.redisClient.get(`books:${guid}`);
    if (!book) {
      throw new NotFoundException('The requested book does not exist');
    }
    return JSON.parse(book);
  }
}