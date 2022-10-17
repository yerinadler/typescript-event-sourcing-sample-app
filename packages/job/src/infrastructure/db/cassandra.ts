import { Client } from "cassandra-driver"

export const createCassandraClient = (hosts: string[], dc: string, keyspace: string): Client => {
  const client: Client = new Client({
    contactPoints: hosts,
    localDataCenter: dc,
    keyspace
  });
  return client;
}