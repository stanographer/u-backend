import React from 'react';
import ShareDBBinding from '../ShareDB';
import IntersectionObserver from 'react-intersection-observer';
import IntersectionVisible from 'react-intersection-visible';
import FloatingButtons from './FloatingButtons';
import { animateScroll as scroll } from 'react-scroll';
import { connection, socket } from '../ShareDB/connection';
import { ToastContainer } from 'react-toastify';
import { loadingToast, loadSuccessToast, disconnectToast, reconnectToast } from './UpdateToasts';
import _ from 'lodash';

class LiveTranscriptView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      menuVisible: false,
      style: {}
    };

    const { user, job } = props;
    this.doc = connection.get(user, job);

    this.scrollDown = this.scrollDown.bind(this);
    this.onLoaded = this.onLoaded.bind(this);
  }

  onScrollToBottom(atBottom) {
    if (!atBottom) {
      this.scrollDown();
    }
  }

  onLoaded() {
    loadSuccessToast();
    this.setState({
      loading: false
    }, this.scrollDown);
  }

  scrollDown() {
    setTimeout(() => {
      scroll.scrollToBottom({
        delay: 0,
        duration: 200,
        isDynamic: true
      });
    }, 0);

    this.setState({
      menuVisible: false
    });
  }

  componentDidMount() {
    let hasDisconnected = false;
    loadingToast();

    const notifyDisconnected = _.once(disconnectToast);
    const notifyReconnected = _.once(reconnectToast);

    socket.onclose = () => {
      hasDisconnected = true;
      notifyDisconnected();
    };

    socket.onopen = () => {
      if (hasDisconnected) notifyReconnected();
    };
  }

  componentWillUnmount() {
    this.doc.destroy();
  }

  render() {
    const { menuVisible } = this.state;
    const { style } = this.props;

    return (
      <div className="liveTranscript--container">
        { menuVisible
          ? <FloatingButtons
            scrollDown={ this.scrollDown }
            style={ style } />
          : null
        }
        <div className="liveTranscript"
             onClick={ () => {
               this.setState({
                 menuVisible: true
               });
             } }>
          <ShareDBBinding
            cssClass="liveTranscript--text-format"
            style={ style }
            doc={ this.doc }
            onLoaded={ this.onLoaded }
            flag='≈'
            elementType="div" />
        </div>
        <IntersectionObserver
          threshold={ .1 }
          onChange={ state => this.onScrollToBottom(state) }>
          { ({ inView, ref }) => (
            <div ref={ ref }
                 className="liveTranscript--container_observer"
                 style={ { backgroundColor: style.backgroundColor } } />
          ) }
        </IntersectionObserver>
        <ToastContainer
          draggable
          autoClose={ 5000 } />
      </div>
    );
  }
}

export default LiveTranscriptView;
