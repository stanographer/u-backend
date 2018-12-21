import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import Clipboard from 'react-clipboard.js';
import { withFirebase } from '../Firebase';
import withAuthorization from '../Session/withAuthorization';
import Navigation from '../Navigation';
import queryString from 'query-string';
import connection from '../ShareDB/connection';
import {
  Container,
  Form,
  Input
} from 'reactstrap';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import './index.css';
import otText from 'ot-text';
import { attachTextarea } from '../ShareDB/textarea';

class ConnectedTranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: '',
      uid: '',
      textArea: '',
      clickToCopyShown: false
    };

    this.query = queryString.parse(this.props.location.search);
    this.sharedTextArea = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  componentWillMount() {
    const ottype = otText.type;
    console.log(ottype);
    this.doc = connection.get(this.query.user, this.query.job);

    this.doc.subscribe(error => {
      if (error) {
        this.setState({ error: 'Could not subscribe to the document.' });
      }
      if (!this.doc.type) {
        console.log('creating');
        const defaultData = '';
        const ottype = otText.type.name;
        const source = true;
        const callback = () => console.log(arguments);
        this.doc.create(defaultData, ottype, source, callback);
      }
      const textarea = document.querySelector('textarea');
      attachTextarea(textarea, this.doc);
    });
  }

  componentDidMount() {
    const { firebase } = this.props;
    this.focusTextInput();

    firebase.user(firebase.auth.currentUser.uid).once('value', snapshot => {
      const userSnapshot = snapshot.val();
      this.setState({
        user: userSnapshot,
        uid: firebase.auth.currentUser.uid
      });
    });
  }

  componentWillUnmount() {
    this.doc.destroy();
    this.binding = null;
  }

  focusTextInput() {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.sharedTextArea.current.focus();
  }

  render() {
    const style = {
      color: '#172b4d',
      fontSize: '1.5em',
      height: '20em'
    };

    return (
      <div>
        <Navigation user={ this.state.user } />
        <Container>
          <div className="vertical-padding-3em" />
          <h1 className="display-2">Editor</h1>
          <p className="lead">Click to copy</p>
            <Tooltip
              title="Copied!"
              position="top"
              trigger="click"
              animation="perspective"
              duration={300}
            >
              <Clipboard
                component="a"
                button-href="#"
                data-clipboard-text={ `${ window.location.protocol }//${ window.location.host }/${ this.query.user }/${ this.query.job }` }>{ `${ window.location.protocol }//${ window.location.host }/${ this.query.user }/${ this.query.job }` }
              </Clipboard>
            </Tooltip>
          <div className="vertical-padding-3em" />
          <Form>
            <Input
              cols="80"
              rows={ 10 }
              className="sharedTextArea"
              ref={ this.sharedTextArea }
              placeholder="Start writing here..."
              rows="4"
              type="textarea"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </Form>
        </Container>
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default compose(withRouter, withFirebase, withAuthorization(condition))(ConnectedTranscriptEditor);
