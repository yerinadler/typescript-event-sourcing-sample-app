import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class LoanCreated extends Event implements IEvent {
  eventName = LoanCreated.name;
  aggregateName = 'loan';

  constructor(public guid: string, public bookId: string, public userId: string) {
    super();
  }
}
