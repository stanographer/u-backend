/* Module dependencies */
const app = require('../app');
const debug = require('debug')('upwordly:server');
const http = require('http');
const ottext = require('ot-text');
const ShareDB = require('@teamwork/sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

/* Servers */
const ShareDBMongo = require('sharedb-mongo')(
  process.env.NODE_ENV === 'production'
    ? 'mongodb://mongo:27017/upwordly'
    : 'mongodb://localhost:27017/aloft'
);

const redisPubSub = require('sharedb-redis-pubsub')(
  process.env.NODE_ENV === 'production'
    ? 'redis://redis:6379'
    : 'redis://localhost:6379'
);

function start(port) {
  const share = new ShareDB({
    db: ShareDBMongo,
    pubsub: redisPubSub,
    disableSpaceDelimitedActions: true,
    disableDocAction: true
  });

  ShareDB.types.register(ottext.type);
  app.set('port', port);

  // Create HTTP server & WebSocket server.
  const server = http.createServer(app);
  const socket = new WebSocket.Server({ server });

  socket.on('connection', (websocket, req) => {
    // Test message.
    websocket.on('message', data => {
      if (data === 'ping') {
        websocket.emit('pong');
      }
    });

    websocket.on('message', data => {
      console.log(data);
    });

    websocket.on('close', data => {
      console.log('disconnected', data);
    });

    // Listen to stream.
    const stream = new WebSocketJSONStream(websocket);
    share.listen(stream);
  });

  // Event listener for HTTP server "error" event.
  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  // Event listener for HTTP server "listening" event.
  function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

  // Listen on provided port, on all network interfaces.
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}

module.exports = start;
