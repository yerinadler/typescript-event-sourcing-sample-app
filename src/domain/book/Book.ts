import { AggregateRoot } from '@core/AggregateRoot';
import { BookCreated } from './events/BookCreated';
import { BookAuthorChanged } from './events/BookAuthorChanged';
export class Book extends AggregateRoot {

  public name!: string;
  public authorId!: string;
  public price!: number;

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

  public applyBookCreated(event: BookCreated): void {
    this.guid = event.guid;
    this.name = event.name;
    this.authorId = event.authorId;
    this.price = event.price;
  }

  public applyBookAuthorChanged(event: BookAuthorChanged): void {
    this.authorId = event.authorId;
  }

  public applyBookUpdated(event: any): void {
    this.name = event.name;
    this.author = event.author;
    this.price = event.price;
  }
}
