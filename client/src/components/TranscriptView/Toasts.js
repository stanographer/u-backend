import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faRunning, faCheck, faCog, faExclamation, faWifi } from '@fortawesome/free-solid-svg-icons';
import { Button, ButtonGroup } from 'reactstrap';

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
      <FontAwesomeIcon icon="check" />&nbsp;&nbsp;&nbsp;Live transcription is now active!
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
      <em>Whew! 🦄</em>
    </div>
  );
};

const TranscriptToolsToast = (props) => {
  library.add(faCog);
  return (
    <div>
      <ButtonGroup size="lg" className="transcript--container-toolbar">
        <Button color="primary" onClick={ () => props.scrollDown() }>
          Scroll To Bottom
        </Button>
        <Button color="primary" onClick={ e => props.handleOnClick(e) }><FontAwesomeIcon icon="cog" /></Button>
      </ButtonGroup>

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
    type: toast.TYPE.SUCCESS,
    position: 'bottom-right',
    closeOnClick: true,
    draggable: false,
    className: 'rotateY animated'
  });
};

const disconnectToast = () => {
  if (toast.isActive(toastId)) return;
  return toastId = toast(<DisconnectToast />, {
    autoClose: false,
    position: 'top-center',
    type: toast.TYPE.ERROR,
    closeOnClick: true,
    draggable: true,
    toastId: toastId
  });
};

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

const transcriptToolsToast = (props) => {
  if (toast.isActive(toastId)) return;
  return toastId = toast(<TranscriptToolsToast { ...props } />, {
    autoClose: false,
    position: 'bottom-right',
    type: toast.TYPE.DEFAULT,
    draggable: true,
    toastId: toastId
  });
};

export {
  loadingToast,
  loadSuccessToast,
  disconnectToast,
  reconnectToast,
  transcriptToolsToast
};
