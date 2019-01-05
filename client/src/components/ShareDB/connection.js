import ShareDB from '@teamwork/sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import otText from 'ot-text';

const host = window.location.hostname;
const port = process.env.REACT_APP_WS_PORT || 9090;

const socket = new ReconnectingWebSocket('ws://' + host + ':' + port, [], {
  automaticOpen: true,
  maxReconnectionDelay: 2000,
  reconnectInterval: 2000,
  maxReconnectInterval: 3000,
  timeoutInterval: 2000,
  maxRetries: Infinity
});

const connection = new ShareDB.Connection(socket);
ShareDB.types.register(otText.type);

export default connection;
