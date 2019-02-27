// Component that acts as a container to the transcription component.

import React, { Fragment } from 'react';
import ShareDBBinding from '../ShareDB';
import { InView } from 'react-intersection-observer';
import 'react-intersection-visible';
import { animateScroll as scroll } from 'react-scroll';
import { connection, socket } from '../ShareDB/connection';
import { ToastContainer } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowDown, faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import {
  loadingToast,
  loadSuccessToast,
  disconnectToast,
  reconnectToast,
} from './Toasts';
import TranscriptViewMenu from '../ViewMenu';
import { Col, Row } from 'reactstrap';

class LiveTranscriptView extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      menuVisible: false,
      style: {},
      fabOpen: false,
      autoscrolling: true,
    };

    const { user, job } = props;
    this.doc = connection.get(user, job.slug);

    this.scrollDown = this.scrollDown.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.handleOpenMenu = this.handleOpenMenu.bind(this);
    this.handleMenuEscape = this.handleMenuEscape.bind(this);
  }

  onVisibilityChange(atBottom) {
    const { loading } = this.state;

    if (!atBottom && !loading) {
      this.scrollDown();
    }
  }

  onLoaded() {
    loadSuccessToast();
    this.setState({
      loading: false,
    }, this.scrollDownDelay);
  }

  scrollDown() {
    const { autoscrolling } = this.state;

    setTimeout(() => {
      scroll.scrollToBottom({
        delay: 0,
        duration: 150,
        isDynamic: true,
      });

      if (autoscrolling === false) {
        this.setState({
          autoscrolling: true,
        });
      }
    }, 0);
  }

  scrollDownDelay() {
    setTimeout(() => {
      scroll.scrollToBottom({
        delay: 0,
        duration: 200,
        isDynamic: true,
      });
    }, 490);
  }

  toggleMenu() {
    const { menuVisible, autoscrolling } = this.state;

    this.setState({
      menuVisible: !menuVisible,
    });
  }

  handleOpenMenu(e) {
    // _.debounce(() => this.toggleMenu, 2000);
    this.toggleMenu();
  }

  handleMenuEscape(e) {
    if (e.keyCode === 27) {
      this.setState({
        menuVisible: null,
      });
    }
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
      if (hasDisconnected) return reconnectToast();
    };

    document.addEventListener('keydown', e => {
      this.handleMenuEscape(e);
    }, true);
  }

  componentWillUnmount() {
    // Destroy subscription.
    this.doc.destroy();

    // Remove listener.
    document.removeEventListener('keydown', e => {
      this.handleMenuEscape(e);
    }, true);
  }

  render() {
    library.add(faPlus, faCog);
    library.add(faArrowDown);

    const { style } = this.props;
    const { menuVisible } = this.state;

    return (
      <Fragment>
        <Row>
          <Col lg={ menuVisible ? 8 : 12 } sm={ 12 }>
            <div className="liveTranscript--container"
                 onClick={ () => this.handleOpenMenu() }>
              <div className="liveTranscript">
                <ShareDBBinding
                  handleOpenMenu={ this.handleOpenMenu }
                  handleMenuEscape={ this.handleMenuEscape }
                  ref={ this.observer }
                  cssClass="liveTranscript--text-format"
                  style={ style }
                  doc={ this.doc }
                  onLoaded={ this.onLoaded }
                  flag='≈'
                  elementType="div" />
              </div>
              <InView
                tag="div"
                threshold={ .1 }
                onChange={ state => this.onVisibilityChange(state) } />
              <ToastContainer
                draggable
                autoClose={ 5000 } />
            </div>
          </Col>
          <Col lg={ 4 } sm={ 12 } hidden={ !menuVisible } className="flyoutMenu">
            <TranscriptViewMenu
              visibility={ menuVisible }
              style={ style }
              job={ this.props.job }
              handleOpenMenu={ this.handleOpenMenu }
              scrollDown={ this.scrollDown } />
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default LiveTranscriptView;
