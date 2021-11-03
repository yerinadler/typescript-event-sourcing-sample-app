import { BookAuthorChanged } from './BookAuthorChanged';
import { BookCreated } from './BookCreated';

export type BookEvent = BookCreated | BookAuthorChanged;
