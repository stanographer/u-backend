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
import { faArrowLeft, faLockOpen, faLock, faDownload, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { fetchTranscript } from '../Dashboard/downloadTranscript';
import {
  Button,
  ButtonGroup,
  Card,
  CardText,
  CardTitle,
  Col,
  Form,
  Input,
  Row
} from 'reactstrap';
import { Tooltip } from 'react-tippy';
import { connection } from '../ShareDB/connection';
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
      jobUid: '',
      clickToCopyShown: false
    };

    this.query = queryString.parse(this.props.location.search);
    this.sharedTextArea = React.createRef();
    this.handleCountWords = this.handleCountWords.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
  }

  componentWillMount() {
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
    const { firebase } = this.props;

    this.doc.destroy();
    this.binding = null;
    firebase.user().off();
    firebase.jobById().off();
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

    firebase.user(firebase.auth.currentUser.uid)
      .child(`jobs/${ this.query.job }`)
      .on('value', snapshot => {
        if (!snapshot) return new Error('Cannot find snapshot');
        this.setState({
          jobUid: snapshot.val().id
        });
        firebase.jobById(snapshot.val().id)
          .on('value', foundJob => {
            this.setState({
              job: foundJob.val()
            });
          });
      });
  }

  toggleComplete() {
    const { firebase } = this.props;
    const { job, jobUid } = this.state;

    if (job.completed) {
      firebase.jobById(jobUid)
        .update({ completed: false }, () => {
          this.setState({
            job: { ...job, completed: false }
          });
          console.log(this.state);
        });
    } else {
      const dateOptions = { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' };
      firebase.jobById(jobUid)
        .update({ completed: true, timeCompleted: new Date().toUTCString() }, () => {
          this.setState({
            job: { ...job, completed: true, timeCompleted: new Date().toUTCString() }
          });
          console.log(this.state);
        });
    }
  }

  render() {
    library.add(faArrowLeft, faLock, faLockOpen, faDownload, faPaperPlane);
    const { job } = this.state;
    console.log(job);

    const style = {
      color: '#172b4d',
      fontSize: '1.5em',
      height: '20em'
    };

    return (
      <div>
        <Row>
          <Col lg={ 6 } sm={ 12 }>
            <div className="editor-wrapper">
              <Form className="editor-class">
                <Input
                  disabled={ job.completed }
                  className="editor"
                  ref={ this.sharedTextArea }
                  placeholder="Start writing here..."
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  type="textarea"
                  autoFocus
                  onChange={ e => this.handleCountWords(e) }
                />
              </Form>
            </div>
          </Col>
          <Col lg={ 6 } sm={ 12 }>
            <div>
              <Link to={ ROUTES.DASHBOARD } className="dashboard-link btn btn-primary align-bottom mt-5 mb-5">
                <FontAwesomeIcon icon="arrow-left" onClick={ this.goBack } />&nbsp;&nbsp;&nbsp;
                Back to Dashboard
              </Link>
              <Card body>
                <CardTitle>{ this.state.job.title ? `"${ this.state.job.title }"` : `"${ this.state.job.slug }"` }</CardTitle>
                <CardText>
                  Speaker(s): { this.state.job.speakers ? this.state.job.speakers : <em>None designated.</em> }<br />
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
                <CardTitle>INFO</CardTitle>
                <CardText>
                  Created: <strong>{`${new Date(job.timeCreated).toLocaleDateString('en-US')},
                  ${new Date(job.timeCreated).toLocaleTimeString('en-GB')}`}</strong>
                  <br />
                  Completed: <strong>{ job.timeCompleted ? `${ new Date(job.timeCompleted).toLocaleDateString('en-US') }, ${ new Date(job.timeCompleted).toLocaleTimeString('en-GB') }` : 'Job was never marked completed.' }</strong>
                </CardText>
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
              <Card body>
                <CardTitle>ACTIONS</CardTitle>
                <ButtonGroup color="info">
                  <Button color="primary"
                          onClick={ () => fetchTranscript(job.username, job.slug) }><FontAwesomeIcon
                    icon="download" />&nbsp;&nbsp;&nbsp;Save</Button>
                  <Button color="primary" disabled><FontAwesomeIcon icon="paper-plane" />&nbsp;&nbsp;&nbsp;Send</Button>
                  <Button onClick={ () => this.toggleComplete() }
                          color={ job.completed ? 'success' : 'primary' }>
                    <FontAwesomeIcon icon={ job.completed ? 'lock' : 'lock-open' } />
                    &nbsp;&nbsp;&nbsp;{ job.completed ? 'Completed' : 'Editing' }
                  </Button>
                </ButtonGroup>
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
