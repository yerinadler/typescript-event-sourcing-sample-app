export abstract class Event {
  public version!: number;

  constructor(public eventType?: string) {}
}
