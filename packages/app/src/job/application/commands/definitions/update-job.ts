import { Command } from '@cqrs-es/core';

export class UpdateJobCommand extends Command {
  public title: string;
  public description: string;
  public readonly originalVersion: number;

  constructor(guid: string, title: string, description: string, originalVersion: number) {
    super(guid);
    this.title = title;
    this.description = description;
    this.originalVersion = originalVersion;
  }
}
