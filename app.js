/**
 * @type {any}
 */
const fastify = require('fastify')({logger: true});
const production = process.env.PRODUCTION !== null;
const port = process.env.PORT || 9999;

// Creates an echo server.
function handle(conn) {
  conn.pipe(conn);
}

fastify.register(require('fastify-websocket'), {
  handle,
  options: {
    maxPayload: 1048576, // we set the maximum allowed messages size to 1 MiB (1024 bytes * 1024 bytes)
  },
});

fastify.register(require('fastify-cors'), {
  origin: (origin, cb) => {

    // Request from localhost will pass.
    if (/localhost/.test(origin)) {
      cb(null, true);
      return;
    }

    cb(null, true);
  },
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
});

fastify.route({
  method: 'GET',
  url: '/',

  // Handles http requests.
  handler: (req, reply) => {
    reply.send('hey bitch');
  },

  // Handles websockets connections.
  wsHandler: (conn, req) => {
    conn.setEncoding('utf8');
    conn.write('hello frontend');
    conn.on('message', message => conn.socket.send('hi there!'));
  },
});

// Run the server-service!
const start = async () => {
  try {
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

start();
