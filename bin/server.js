/* Module dependencies */
const app = require('../app');
const debug = require('debug')('upwordly:server');
const http = require('http');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

function startServer(port, ws_port) {
  const sharedb = app.sharedb;
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
    sharedb.listen(stream);
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
  server.listen(ws_port, () => console.log('WS port running on: ' + port));
  app.listen(port, () => console.log('App port unning on: ' + port));

  server.on('error', onError);
  server.on('listening', onListening);

  app.on('error', onError);
  app.on('listening', onListening);
}

module.exports = startServer;
