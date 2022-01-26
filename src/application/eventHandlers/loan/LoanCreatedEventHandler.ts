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

  async handle(message: string) {
    const event: LoanCreated = JSON.parse(message);
    console.log(`Book with the ID ${event.bookId} loaned by the user ${event.userId}`);
    await this.commandBus.send(new MarkBookAsBorrowedCommand(event.bookId));
  }
}
