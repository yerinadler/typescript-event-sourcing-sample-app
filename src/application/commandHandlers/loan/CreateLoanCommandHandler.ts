import { inject, injectable } from 'inversify';

import { CreateLoanCommand } from '@commands/loan/CreateLoan';
import { TYPES } from '@constants/types';
import { ICommandHandler } from '@core/ICommandHandler';
import { ILoanRepository } from '@domain/loan/ILoanRepository';
import { Loan } from '@domain/loan/Loan';

@injectable()
export class CreateLoanCommandHandler implements ICommandHandler<CreateLoanCommand> {
  constructor(@inject(TYPES.LoanRepository) private readonly repository: ILoanRepository) {}
  public static commandToHandle: string = CreateLoanCommand.name;
  async handle(command: CreateLoanCommand) {
    const loan: Loan = new Loan(command.guid, command.bookId, command.userId);
    await this.repository.save(loan, -1);
  }
}
