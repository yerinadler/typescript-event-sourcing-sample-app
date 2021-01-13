export interface IDataMapper<TDomainEntity> {
  toDomain(dalEntity: any): TDomainEntity;
  toDalEntity(entity: TDomainEntity): any;
}
