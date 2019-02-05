import React from 'react';
import ShareDBBinding from '../ShareDB';
import { InView } from 'react-intersection-observer';
import 'react-intersection-visible';
import { animateScroll as scroll } from 'react-scroll';
import { connection, socket } from '../ShareDB/connection';
import { ToastContainer } from 'react-toastify';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowDown, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';

import {
  loadingToast,
  loadSuccessToast,
  disconnectToast,
  reconnectToast
} from './Toasts';
import TranscriptViewMenu from '../TranscriptViewMenu';

class LiveTranscriptView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      menuVisible: false,
      style: {},
      fabOpen: false
    };

    const { user, job } = props;
    this.doc = connection.get(user, job.slug);

    this.scrollDown = this.scrollDown.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);
  }

  onScrollToBottom(atBottom) {
    const { loading } = this.state;

    if (!atBottom && !loading) {
      this.scrollDown();
    }
  }

  onLoaded() {
    loadSuccessToast();
    this.setState({
      loading: false
    }, this.scrollDownDelay);
  }

  scrollDown() {
    setTimeout(() => {
      scroll.scrollToBottom({
        delay: 0,
        duration: 200,
        isDynamic: true
      });
    }, 0);
  }

  scrollDownDelay() {
    setTimeout(() => {
      scroll.scrollToBottom({
        delay: 0,
        duration: 200,
        isDynamic: true
      });
    }, 470);
  }

  toggleMenu() {
    const { menuVisible } = this.state;

    this.setState({
      menuVisible: !menuVisible
    });
  }

  handleMenuClick() {
    this.toggleMenu();
  }

  componentDidMount() {
    // HasConnected makes sure that the disconnection message isn't
    // shown to the user at start-up.
    let hasDisconnected = false;
    loadingToast();

    // Will display a message to the user that the connection was lost.
    socket.onclose = () => {
      hasDisconnected = true;
      disconnectToast();
    };

    // Will display a message to the user that the connection is rectified.
    socket.onopen = () => {
      if (hasDisconnected) reconnectToast();
    };
  }

  componentWillUnmount() {
    // Destroy subscription.
    this.doc.destroy();
  }

  render() {
    library.add(faPlus, faCog);
    library.add(faArrowDown);

    const { style } = this.props;
    const { menuVisible } = this.state;
    const fabPosition = {
      top: 2,
      right: 2
    };

    return (
      <>
        <Fab
          mainButtonStyles={ { color: '#fff', backgroundColor: '#072247' } }
          position={ fabPosition }
          icon={ <FontAwesomeIcon icon="plus" /> }
          event={ 'click' }
        >
          <Action
            style={ { backgroundColor: '#ffd460', color: '#083358' } }
            text="Scroll to Bottom"
            onClick={() => this.scrollDown()}
          >
            <FontAwesomeIcon icon="arrow-down"/>
          </Action>
          <Action
            text="Settings"
            onClick={() => this.handleMenuClick()}
          >
            <FontAwesomeIcon icon="cog"/>
          </Action>
        </Fab>
        <TranscriptViewMenu visibility={ menuVisible } style={style} job={this.props.job} handleMenuClick={ this.handleMenuClick } />
        <div className="liveTranscript--container">
          <div className="liveTranscript">
            <ShareDBBinding
              ref={ this.observer }
              cssClass="liveTranscript--text-format"
              style={ style }
              doc={ this.doc }
              onLoaded={ this.onLoaded }
              flag='≈'
              elementType="div" />
          </div>
          <InView tag="div" threshold={ .1 } onChange={ state => this.onScrollToBottom(state) } />
          <ToastContainer
            draggable
            autoClose={ 5000 } />
        </div>
      </>
    );
  }
}

export default LiveTranscriptView;
