/* Mongo and Redis Servers */
const mongo = require('sharedb-mongo')(
  process.env.NODE_ENV === 'production'
    ? 'mongodb://mongo:27017/upwordly'
    : 'mongodb://localhost:27017/aloft'
);

const redis = require('sharedb-redis-pubsub')(
  process.env.NODE_ENV === 'production'
    ? 'redis://redis:6379'
    : 'redis://localhost:6379'
);

module.exports = {
  mongo,
  redis
};
