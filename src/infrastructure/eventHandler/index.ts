import { TYPES } from "@constants/types";
import { IEventHandler } from "@core/IEventHandler";
import { BookEvent } from "@domain/book/events";
import { injectable, multiInject } from "inversify";

@injectable()
export class EventHandler {
  constructor(
    @multiInject(TYPES.Event) private readonly eventHandlers: IEventHandler<BookEvent>[],
  ) {}

  initialise() {
    for (const handler of this.eventHandlers) {
      handler.handle();
    }
  }
}