export default {
  API_PORT: process.env.API_PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  DB_NAME: process.env.DB_NAME || 'bookstore',
  REDIS_URI: process.env.REDIS_URI || 'redis://localhost:6379',
};
