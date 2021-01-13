import { IEvent } from "@core/IEvent";
import { Event } from "@core/Event";

export class BookUpdated extends Event implements IEvent {
  constructor(
    public guid: string,
    public name: string,
    public author: string,
    public price: number
  ) {
    super(BookUpdated.name);
  }
}