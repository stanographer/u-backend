const apiRouter = require('./routes/api');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const cluster = require('cluster');
const cowsay = require('cowsay');
const express = require('express');
const http = require('http');
const ottext = require('ot-text');
const path = require('path');
const numCPUs = require('os').cpus().length;
const redisPubSub = require('sharedb-redis-pubsub')(
  process.env.NODE_ENV === 'dev'
    ? 'redis://localhost:6379'
    : 'redis://redis:6379');
const ShareDB = require('@teamwork/sharedb');
const WebSocket = require('ws');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');

const ShareDBMongo = require('sharedb-mongo')(
  process.env.NODE_ENV === 'dev'
    ? 'mongodb://localhost:27017/aloft'
    : 'mongodb://mongo:27017/upwordly');
const PORT = process.env.PORT || 9090;

const corsOptions = {
  origin: 'http://localhost:3000',
  // some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200
};

function startServer(port) {
  const share = new ShareDB({
    db: ShareDBMongo,
    pubsub: redisPubSub,
    disableSpaceDelimitedActions: true,
    disableDocAction: true
  });

  ShareDB.types.register(ottext.type);

  // Create a web server to serve files and listen to WebSocket connections
  const app = express();

  // Serve static files from the React app
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static(path.join(__dirname, 'client/build')));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'ejs');
  app.use(cors());
  app.use('/api', apiRouter);

  // Creating server and WebSockets server.
  const server = http.createServer(app);
  const socket = new WebSocket.Server({ server });

  // Global path.
  app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });

  app.get('/moo', cors(corsOptions), async(req, res, next) => {
    try {
      const moo = cowsay.say({ text: 'Hello World!' });
      res.json({ moo });
    } catch (err) {
      next(err);
    }
  });

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

    websocket.on('close', function() {
      console.log('disconnected');
    });

    const stream = new WebSocketJSONStream(websocket);
    share.listen(stream);
  });

  server.listen(port);
  console.log(`Backend listening on port ${ port }. ✅`);
}

if (cluster.isMaster) {
  console.log(`Master ${ process.pid } is running. ✅`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${ worker.process.pid } died. ❌
       Code: ${ code }.
       Signal: ${ signal }`
    );
  });
} else {
  startServer(PORT, '0.0.0.0');
  console.log(`Forked process, ${ process.pid } online. ✅`);
}
