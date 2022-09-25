import { IEventStore } from "@cqrs-es/core";
import { Application } from "./application";

export interface IApplicationEventStore extends IEventStore<Application> {}