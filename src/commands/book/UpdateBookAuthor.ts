import { Command } from '@core/Command';

export class UpdateBookAuthorCommand extends Command {
  constructor(public readonly guid: string, public readonly authorId: string, public readonly originalVersion: number) {
    super(guid);
  }
}
