import ShareDB from '@teamwork/sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import otText from 'ot-text';

const server = {
  host: process.env.REACT_APP_ENV === 'production' ? 'upword.ly/ws' : window.location.hostname,
  port: process.env.REACT_APP_ENV === 'production' ? '' : ':9090',
  protocol: process.env.REACT_APP_ENV === 'production' ? 'wss://' : 'ws://',
  getAddress: function() {
    return this.protocol + this.host + this.port;
  },
};

const socket = new ReconnectingWebSocket(server.getAddress(), [], {
  automaticOpen: true,
  maxReconnectionDelay: 2000,
  reconnectInterval: 2000,
  maxReconnectInterval: 3000,
  timeoutInterval: 2000,
  maxRetries: Infinity,
});

const connection = new ShareDB.Connection(socket);
ShareDB.types.register(otText.type);

export {
  connection,
  socket,
};
