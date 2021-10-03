import { io } from 'socket.io-client';
import { groups, error } from './store';

const webSocket = (hostIp) => {
  let ip = hostIp.split(/\:|\./).join('-');
  const socket = io(`https://${ip}.my.local-ip.co:8080/`, {
    forceNew: true,
    reconnectionAttempts: 9,
  });
  socket.on('connect_error', function () {
    error.set('Connection Error try again.');
  });
  socket.on('connect', () => {
    error.set('');
    socket.emit('hostIp', { hostIp });
  });

  socket.on('open', () => {
    console.log('[open] Connection established');
    console.log('Sending to server');
  });

  socket.on('message', (data) => {
    if (data.error) {
      console.log('message  error: ' + data.error);
      groups.set([]);
      return error.set(data.message);
    }
    error.set('');
    getGroups();
  });
  socket.on('groups', (data) => {
    error.set('');
    groups.set(data.groups);
  });

  socket.on('close', (event) => {
    console.log(event.reason);
  });

  socket.on('error', (error) => {
    console.log(`[error] ${JSON.stringify(error)}`);
  });

  socket.on('disconnect', () => {
    groups.set([]);
    error.set('Server Disconnected');
  });

  const wsDisconnect = () => {
    groups.set([]);
    socket.disconnect();
  };

  const changeGroupState = (group) => {
    var msg = {
      changeState: true,
      group: {
        id: group.id,
        active: group.active,
      },
    };
    socket.volatile.emit('message', msg);
  };

  const buttonPress = (data) => {
    socket.volatile.emit('button-press', data);
  };

  const getGroups = () => {
    socket.volatile.emit('get-groups', {});
  };

  return { changeGroupState, buttonPress, wsDisconnect };
};

export default webSocket;
