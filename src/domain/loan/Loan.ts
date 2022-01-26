import { AggregateRoot } from '@core/AggregateRoot';

import { LoanCreated } from './events/LoanCreated';

export class Loan extends AggregateRoot {
  public bookId: string;
  public userId: string;

  constructor();

  constructor(guid: string, bookId: string, userId: string);

  constructor(guid?: string, bookId?: string, userId?: string) {
    super(guid);
    if (guid && bookId && userId) {
      this.applyChange(new LoanCreated(guid, bookId, userId));
    }
  }

  applyLoanCreated(event: LoanCreated) {
    this.guid = event.guid;
    this.userId = event.userId;
    this.bookId = event.bookId;
  }
}
