/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AggregateRoot } from '@core/AggregateRoot';

import { BookAuthorChanged } from './events/BookAuthorChanged';
import { BookBorrowed } from './events/BookBorrowed';
import { BookCreated } from './events/BookCreated';
export class Book extends AggregateRoot {
  public name!: string;
  public authorId!: string;
  public price!: number;
  public isBorrowed = false;

  constructor();

  constructor(guid: string, name: string, authorId: string, price: number);

  constructor(guid?: string, name?: string, authorId?: string, price?: number) {
    super(guid);
    // This if block is required as we instantiate the aggregate root in the repository
    if (guid && name && authorId && price) {
      this.applyChange(new BookCreated(this.guid, name!, authorId!, price!));
    }
  }

  public changeAuthor(authorId: string) {
    this.authorId = authorId;
    this.applyChange(new BookAuthorChanged(this.guid, authorId));
  }

  public markAsBorrowed() {
    this.isBorrowed = true;
    this.applyChange(new BookBorrowed(this.guid));
  }

  public applyBookCreated(event: BookCreated): void {
    this.guid = event.guid;
    this.name = event.name;
    this.authorId = event.authorId;
    this.price = event.price;
  }

  public applyBookAuthorChanged(event: BookAuthorChanged): void {
    this.authorId = event.authorId;
  }

  public applyBookBorrowed() {
    this.isBorrowed = true;
  }
}
