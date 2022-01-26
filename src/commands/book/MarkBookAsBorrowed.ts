import { Command } from '@core/Command';

export class MarkBookAsBorrowedCommand extends Command {
  constructor(public readonly guid: string) {
    super(guid);
  }
}
