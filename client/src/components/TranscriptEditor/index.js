import React from 'react';
import { compose } from 'recompose';
import { withRouter, Link } from 'react-router-dom';
import Clipboard from 'react-clipboard.js';
import * as ROUTES from '../../constants/routes';
import { withFirebase } from '../Firebase';
import withAuthorization from '../Session/withAuthorization';
import queryString from 'query-string';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  Card,
  CardText,
  CardTitle,
  Col,
  Form,
  Input,
  Row
} from 'reactstrap';
import { Tooltip } from 'react-tippy';
import connection from '../ShareDB/connection';
import 'react-tippy/dist/tippy.css';
import './index.css';
import otText from 'ot-text';
import { attachTextarea } from '../ShareDB/textarea';

class ConnectedTranscriptEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      docLength: 0,
      docWords: 0,
      user: '',
      uid: '',
      textArea: '',
      job: {},
      clickToCopyShown: false
    };

    this.query = queryString.parse(this.props.location.search);
    this.sharedTextArea = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
    this.handleCountWords = this.handleCountWords.bind(this);
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
        console.log('Creating document...');
        const defaultData = '';
        const ottype = otText.type.name;
        const source = true;
        const callback = () => {
          console.log(arguments);
        };
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
    return this.findJob();
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

  handleCountWords(e) {
    const wordCount = !!e.target.value && e.target.value.split(' ').length;
    this.setState({
      docLength: !!e.target.value && e.target.value.length,
      docWords: wordCount
    });
  }

  findJob() {
    const { firebase } = this.props;

    firebase.jobsBySlug(this.query.job).once('value', snapshot => {
      if (!snapshot.val()) {
        return;
      }
      const returnedJob = snapshot.val();

      this.setState({
        job: returnedJob[Object.keys(returnedJob)[0]],
        loading: false
      });
    });
  }

  render() {
    library.add(faArrowLeft);

    const style = {
      color: '#172b4d',
      fontSize: '1.5em',
      height: '20em'
    };

    return (
      <div>
        <Row>
          <Col lg={ 6 }>
            <div className="editor-wrapper">
              <Form className="editor-class">
                <Input
                  className="editor"
                  ref={ this.sharedTextArea }
                  placeholder="Start writing here..."
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  type="textarea"
                  onChange={ e => this.handleCountWords(e) }
                />
              </Form>
            </div>
          </Col>
          <Col lg={ 6 }>
            <div>
              <Link to={ ROUTES.DASHBOARD } className="dashboard-link btn btn-primary align-bottom mt-5 mb-5">
                <FontAwesomeIcon icon="arrow-left" onClick={ this.goBack } />&nbsp;&nbsp;&nbsp;
                Back to Dashboard
              </Link>
              <Card body>
                <CardTitle>"{ this.state.job.title }"</CardTitle>
                <CardText>
                  Speaker(s): { this.state.job.speakers }<br />
                </CardText>
                <Tooltip
                  title="Copied!"
                  position="top"
                  trigger="click"
                  animation="perspective"
                  duration={ 300 }>
                  <Clipboard
                    component="a"
                    button-href="#"
                    data-clipboard-text={ `${ window.location.protocol }//${ window.location.host }/${ this.query.user }/${ this.query.job }` }>{ `${ window.location.protocol }//${ window.location.host }/${ this.query.user }/${ this.query.job }` }
                  </Clipboard>
                </Tooltip>
              </Card>
              <Card body>
                <CardTitle>STATS</CardTitle>
                {
                  this.state.docLength === 0
                    ? <CardText>
                      <em>Begin writing to see document stats.</em>
                    </CardText>
                    : <CardText>
                      Words: { this.state.docWords }<br />
                      Characters: { this.state.docLength }
                    </CardText>
                }
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

const condition = authUser => !!authUser;
export default compose(
  withRouter,
  withFirebase,
  withAuthorization(condition)
)(ConnectedTranscriptEditor);
