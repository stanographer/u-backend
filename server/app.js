/* Dependencies */
const cookieParser = require('cookie-parser');
const cluster = require('cluster');
const cors = require('cors');
const express = require('express');
const http = require('http');
const indexRouter = require('./routes');
const ottext = require('ot-text');
const path = require('path');
const numCPUs = require('os').cpus().length;
const ShareDB = require('@teamwork/sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

/* Routers */
const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');

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

/* Port config */
const PORT = process.env.PORT || 1988;
const WS_PORT = process.env.PORT || 9090;

/* Main process */
function startServer(port, ws_port) {
  const share = new ShareDB({
    db: ShareDBMongo,
    pubsub: redisPubSub,
    disableSpaceDelimitedActions: true,
    disableDocAction: true
  });

  ShareDB.types.register(ottext.type);

  // Create a web server to serve files and listen to WebSocket connections
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());
  app.set('view engine', 'ejs');
  app.use('/', indexRouter);
  app.use('/api', apiRouter);

  // Global path.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });

  // Creating server and WebSockets server.
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

  // Create master process.
  app.listen(port, () =>
    console.log(`Backend listening on port ${ port }. 📡✅`));

  server.listen(ws_port, () =>
    console.log(`WebSockets listening on port ${ ws_port }. 🔌✅`));
}

if (cluster.isMaster) {
  console.log(`Master ${ process.pid } is running. ✅`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(
      `Worker ${ worker.process.pid } died. ❌
       Code: ${ code }.
       Signal: ${ signal }`
    );

    // Re-spawn after failure.
    cluster.fork();
    console.log('Restarting... ✝');
  });
} else {
  startServer(PORT, WS_PORT);
  console.log(`Worker process, ${ process.pid } online. 👷`);
}
