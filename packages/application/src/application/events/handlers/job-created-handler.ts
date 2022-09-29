import { IEventHandler } from "@cqrs-es/core";
import { TYPES } from "@src/types";
import { inject, injectable } from "inversify";
import { Redis } from "ioredis";
import { JobCreated } from "../definitions/job-created";

@injectable()
export class JobCreatedEventHandler implements IEventHandler<JobCreated> {
  public event = JobCreated.name; 

  constructor(
    @inject(TYPES.Redis) private readonly _redisClient: Redis
  ) {}

  async handle(event: JobCreated) {
    await this._redisClient.set(`job-repl:${event.guid}`, JSON.stringify({
      guid: event.guid,
      title: event.title,
      version: event.version
    }));
  }
}