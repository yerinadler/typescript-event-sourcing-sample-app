import { IEventStore } from "@cqrs-es/core";
import { Job } from "./job";

export interface IJobEventStore extends IEventStore<Job> {}