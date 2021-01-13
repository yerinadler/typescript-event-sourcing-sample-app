// import { injectable } from 'inversify';
// import { IDataMapper } from '@core/IDataMapper';
// import { Book } from '@domain/book/Book';

// @injectable()
// export class BookDataMapper implements IDataMapper<Book> {
//   toDomain(bookDbResult: any) {
//     const { name, author, price, guid } = bookDbResult;
//     return new Book({ name, author, price }, guid);
//   }

//   toDalEntity(bookEntity: Book) {
//     return bookEntity;
//   }
// }
