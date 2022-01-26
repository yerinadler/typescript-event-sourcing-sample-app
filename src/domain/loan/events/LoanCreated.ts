import { Event } from '@core/Event';
import { IEvent } from '@core/IEvent';

export class LoanCreated extends Event implements IEvent {
  constructor(public guid: string, public bookId: string, public userId: string) {
    super(LoanCreated.name);
  }
}
