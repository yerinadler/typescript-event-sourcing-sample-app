import { IEventHandler } from "@cqrs-es/core";
import { TYPES } from "@src/types";
import { inject, injectable } from "inversify";
import { Redis } from "ioredis";
import { Logger } from "winston";
import { JobCreated } from "../definitions/job-created";

@injectable()
export class JobCreatedEventHandler implements IEventHandler<JobCreated> {
  public event = JobCreated.name; 

  constructor(
    @inject(TYPES.Redis) private readonly _redisClient: Redis,
    @inject(TYPES.Logger) private readonly _logger: Logger
  ) {}

  async handle(event: JobCreated) {
    await this._redisClient.set(`job-repl:${event.guid}`, JSON.stringify({
      guid: event.guid,
      title: event.title,
      version: event.version
    }));
    this._logger.info(`replicated job for the application => ${JSON.stringify(event)}`);
  }
}