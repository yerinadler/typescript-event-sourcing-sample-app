# TypeScript CQRS & Event Sourcing Boilerplate

**Note:** This project is a experimental project that leverages the concepts of `CQRS` and `Event Sourcing`. However, the events as written in this project are the results of the `Strategic Design` and this project can be used during the `Tactical Design` phase

### Business Scenario
The business scenario in this project is the job application. Let's imagine we are building a platform that allows users to apply to their desired jobs. So below is the requirement

1. The admin can create a job with the required information e.g. description, title, etc.
2. The admin can archive the job but there is no way he/she can delete the job.
3. The job can be updated at any time.
4. Once the job is created, the user can browse through the list of applications and may choose to apply to any of them.
5. After the user successfully filled in the required information. The application is created.

### Foreword from the author

This API project utilises information from multiple sources to create the fine-tuned API product with the following objectives

1. To build a maintainable enterprise grade application
2. The application that follows `SOLID` principles as much as possible
3. To build an application that benefits most of the stakeholders in an organisation
4. To decouple the read and the write side of the application. Thus, they can be scaled indenpendently
5. To build the CQRS and Event Sourcing system

### Architecture

This project uses DDD with Onion Architecture as illustrated in below images

Below image illustrates the more detailed architecture

![](assets/architecture.png)

In CQRS & Event Sourcing systems, the main idea is to implement different data models for read and write sides of the application.

The workflow is that the write side sends the `commands` to the `command handlers` through `commandBus` to alter the information. The succeeded commands will then generate resulting `events` which are then stored in the `event store`. Finally, the `event handlers` subscribe to events and generate the denormalised data ready for the query. Please note that the events could also be handled by multiple event handlers. Some of them may handle notification tasks.

The only source of truth of Event Sourcing systems is the `event store` while the data in the read store is simply a derivative of the events generated from the write side. This means we can use totally different data structure between the read and the write sides and we can replay the events from the event store from the whenever we want the regenerate the denormalised data in whatever shapes we want.

In this example, we use `MongoDB` as an event store and `Redis` as the read store.

The commands are sent by the frontend to the `commandBus` which then selects appropriate `command handlers` for the commands. The command handlers then prepare the `Aggregate Root` and apply the business logic suitable for them. If the commands succeed, they result in events which will then be sent to the `eventBus` to the `event handlers`. In this example, the eventBus is implemented using `Apache Kafka`.

To read more about CQRS and Event Sourcing. Please check [this link](https://docs.microsoft.com/en-us/azure/architecture/patterns/cqrs)

In order to demonstrate the use case with inter-service communication. Two seprate microservices for job and application is created. So a job microservice manages job (create, update, archive) and application microservice manages the user application.

The pattern in `Event-Driven Architecture` called `Event-Carried State Transfer` is used between job and application microservices. When the job is created, the `JobCreated` event is embedded with the job information as a payload so the application microservice uses this information to replicate the job information for local query. Thus, whenever the application microservice needs the job information, it does not make a direct RPC / REST call to the job microservice at all.

### Technologies

1. Node.js
2. TypeScript
3. MongoDB with MongoDB native driver as an event store (mongodb package on NPM)
4. InversifyJS as an IoC container
5. Express (via Inversify Express Utils) as an API framework
6. Redis as a read store for application microservice
7. Apache Cassandra as a read store for job microservice
8. Apache Kafka as a message broker / event bus

## Components

This project follows the standard CQRS & Event Sourcing applications available on GitHub. Highly inspired by Greg Young's SimpleCQRS project (written in ASP.NET C#).

Below is the list of components in this project

1. **Domain Model** (Aggregate Root)<br/>
   Contains the business logic required for the application
2. **Commands**<br/>
   The command class which implements `ICommand` interface. This reflects the intention of the users to alter the state of the application
3. **CommandHandlers**<br/>
   The command processor managed by `CommandBus`. It prepares the Aggregate Root and applies business logic on it.
4. **CommandBus**<br/>
   The command management object which receieves incoming commands and select appropriate handlers for them. Please note that in order to use the command handlers. They must be registered to the `CommandBus` first at `entrypoint.ts` file.
5. **Events**<br/>
   The resulting objects from describing the changes generated by succeeding commands which are sent through the `EventBus`. This class implements `IEvent` interface.
6. **Event Store**
   The storage that stores events. This is the only source of truth of the system (The sequence of events generated by the application).
7. **EventBus**<br/>
   The bus that contains the events where event handlers subscribe to. In this example, `Apache Kafka` is used to implement this
8. **Event Handlers**<br/>
   The event processor. This could be the projector or the denormaliser that generates the data for the read side on the read storage.

## Getting Started

To run the project, make sure you have these dependencies installed on your system

> The `docker-compose.yml` containing all dependencies for running the project is provided
> but make sure you have at least 8GB of RAM available on your local machine before running these dependencies

1. Node.js v8 or later
2. Typescript with `tsc` command
3. Nodemon
4. ts-node
5. MongoDB
6. Redis Server and Clients (redis-cli)
7. CQLSH for interacting with Cassandra
8. Docker installed on the machine

You also need to setup and initialise MongoDB database. Then, copy the `.env_example` file into `.env` file by firing the command

```bash
cp .env_template .env
```

Do adjust the `DB_NAME` and `MONGODB_URI` to match your configuration then run

```bash
yarn dev
```
