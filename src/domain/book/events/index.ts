import { BookAuthorChanged } from "./BookAuthorChanged";
import { BookCreated } from "./BookCreated";
import { BookUpdated } from "./BookUpdated";

export type BookEvent = BookCreated | BookAuthorChanged | BookUpdated;