import { TYPES } from '@constants/types';
import { IEvent } from '@core/IEvent';
import { IEventHandler } from '@core/IEventHandler';
import { injectable, multiInject } from 'inversify';

@injectable()
export class EventHandler {
  constructor(
    @multiInject(TYPES.Event) private readonly eventHandlers: IEventHandler<IEvent>[],
  ) {}

  initialise() {
    for (const handler of this.eventHandlers) {
      handler.handle();
    }
  }
}