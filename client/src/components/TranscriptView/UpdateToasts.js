import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRunning, faCheck, faExclamation, faWifi } from '@fortawesome/free-solid-svg-icons';

const NotifyToast = () => {
  library.add(faRunning);
  return (
    <div>
      <FontAwesomeIcon icon="running" />&nbsp;&nbsp;&nbsp;Fetching job!
    </div>
  );
};

const LoadedToast = () => {
  library.add(faCheck);
  return (
    <div>
      <FontAwesomeIcon icon="check" />&nbsp;&nbsp;&nbsp;<strong>Success!</strong>
      <br />
      <br />
      Live transcription is now active.
    </div>
  );
};

const DisconnectToast = () => {
  library.add(faExclamation);
  return (
    <div>
      <FontAwesomeIcon icon="exclamation" />&nbsp;&nbsp;&nbsp;<strong>Connection lost!</strong>
      <br />
      <em>Attempting to reconnect...</em>
      <br />
      <br />
      You can also try refreshing the page.
    </div>
  );
};

const ReconnectToast = () => {
  library.add(faWifi);
  return (
    <div>
      <FontAwesomeIcon icon="wifi" />&nbsp;&nbsp;&nbsp;<strong>Connection restored.</strong>
      <br />
      <em>Whew!</em>
    </div>
  );
};

let toastId = null;

const loadingToast = () => toastId = toast(<NotifyToast />, {
  autoClose: false,
  position: 'bottom-right',
  type: toast.TYPE.WARNING,
  closeOnClick: true,
  draggable: true
});

const loadSuccessToast = () => {
  toast.dismiss(toastId);
  toast(<LoadedToast />, {
    autoClose: 3000,
    type: toast.TYPE.DEFAULT,
    position: 'bottom-right',
    closeOnClick: true,
    draggable: false,
    className: 'rotateY animated'
  });
};

const disconnectToast = () => toastId = toast(<DisconnectToast />, {
  autoClose: false,
  position: 'top-center',
  type: toast.TYPE.ERROR,
  closeOnClick: true,
  draggable: true,
  toastId: toastId
});

const reconnectToast = () => {
  toast.dismiss(toastId);
  toast(<ReconnectToast />, {
    autoClose: 1500,
    position: 'top-center',
    type: toast.TYPE.SUCCESS,
    closeOnClick: true,
    draggable: true
  });
};

export {
  loadingToast,
  loadSuccessToast,
  disconnectToast,
  reconnectToast
};
