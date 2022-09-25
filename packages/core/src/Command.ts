import { ICommand } from 'interfaces/ICommand';
import { nanoid } from 'nanoid';


export abstract class Command implements ICommand {
  public guid: string;

  constructor(guid?: string) {
    this.guid = guid || nanoid();
  }
}
