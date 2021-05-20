import { NAMES, TYPES } from '@constants/types';
import { IEventStore } from '@core/IEventStore';
import { IUserRepository } from '@domain/user/IUserRepository';
import { User } from '@domain/user/User';
import { inject, injectable, named } from 'inversify';
import { Repository } from './Repository';

@injectable()
export class UserRepository extends Repository<User> implements IUserRepository {
  constructor(
    @inject(TYPES.EventStore) @named(NAMES.UserEventStore) private readonly eventstore: IEventStore,
  ) {
    super(eventstore, User);
  }
}