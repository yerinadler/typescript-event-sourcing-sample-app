import { inject, injectable } from 'inversify';

import { MarkBookAsBorrowedCommand } from '@commands/book/MarkBookAsBorrowed';
import { TYPES } from '@constants/types';
import { ICommandBus } from '@core/ICommandBus';
import { IEventHandler } from '@core/IEventHandler';
import { LoanCreated } from '@domain/loan/events/LoanCreated';

@injectable()
export class LoanCreatedEventHandler implements IEventHandler<LoanCreated> {
  public event: string = LoanCreated.name;

  constructor(@inject(TYPES.CommandBus) private readonly commandBus: ICommandBus) {}

  async handle(event: LoanCreated) {
    console.log(`Book with the ID ${event.bookId} loaned by the user ${event.userId}`);
    this.commandBus.send(new MarkBookAsBorrowedCommand(event.bookId));
  }
}
