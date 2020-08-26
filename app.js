/**
 * @type {any}
 */
const fastify = require('fastify')({logger: true});
const production = process.env.PRODUCTION !== null;
const ShareDB = require('sharedb');
const richText = require('rich-text');
const WebSocketJSONStream = require('@teamwork/websocket-json-stream');
const port = process.env.PORT || 9999;

// Register as rich-text type.
ShareDB.types.register(richText.type);
let backend = new ShareDB({presence: true});

// Remove this later. ------------------
const subscribe = () => {
  let connection = backend.connect();
  let doc = connection.get('examples', 'richtext');

  doc.fetch(function(err) {
    if (err) throw err;
    if (doc.type === null) {
      doc.create([{insert: 'Hi!'}], 'rich-text', () => console.log('success?'));
      return;
    }
  });
};

// Run the server-service!
const start = async () => {
  try {
    subscribe();
    await fastify.listen(port, '0.0.0.0', (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      fastify.log.info(`server listening on ${address}`);
    });

    fastify.log.info(`Listening to containter address: http://localhost:${port} ${production ? '(on production)' : ''}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

fastify.register(require('fastify-websocket'), {
  options: {
    maxPayload: 1048576, // we set the maximum allowed messages size to 1 MiB (1024 bytes * 1024 bytes)
  },
});

fastify.get('/', { websocket: true }, function wsHandler (connection, req) {

  // Bind to fastify server.
  connection.socket.on('connection', ws => {
    console.log('Connection established with: ', ws);
    let stream = new WebSocketJSONStream(ws);
    backend.listen(stream);
  });

  connection.socket.on('message', message => {
    connection.socket.send('hi from server');
  });
});


start();
