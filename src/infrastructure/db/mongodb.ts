import { MongoClientOptions, MongoClient, Db } from 'mongodb';

import config from '@config/main';

export const createMongodbConnection = async (
  host: string,
  options: MongoClientOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
): Promise<Db> => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(host, options, (error, client) => {
      if (error) reject(error);
      resolve(client.db(config.DB_NAME));
    });
  });
};
