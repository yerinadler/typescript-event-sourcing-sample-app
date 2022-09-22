import { nanoid } from 'nanoid';

import { ICommand } from './ICommand';

export abstract class Command implements ICommand {
  public guid: string;

  constructor(guid?: string) {
    this.guid = guid || nanoid();
  }
}
