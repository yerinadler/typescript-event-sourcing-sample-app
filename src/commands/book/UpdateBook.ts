import { Command } from "@core/Command";

export class UpdateBookCommand extends Command {
  constructor(
    public readonly guid: string,
    public readonly name: string,
    public readonly author: string,
    public readonly price: number,
    public readonly originalVersion: number,
  ) {
    super(guid);
  }
}