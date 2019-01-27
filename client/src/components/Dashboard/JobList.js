import React from 'react';
import { Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import {
  Card,
  CardBody,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Table,
  UncontrolledDropdown,
  UncontrolledTooltip
} from 'reactstrap';
import { fetchTranscript } from './downloadTranscript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

class JobList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      jobs: [],
      selectedJobs: [],
      loading: true,
      user: {}
    };

    this.handleJobCheck = this.handleJobCheck.bind(this);
    this.handleDeleteJobs = this.handleDeleteJobs.bind(this);
    this.handleDownloadJobs = this.handleDownloadJobs.bind(this);
  }

  componentDidMount() {
    this.fetchUserThenJobs();
  }

  componentWillUnmount() {
    this.props.firebase.allJobs().off();
    this.props.firebase.user().off();
  }

  fetchUserThenJobs() {
    const { firebase, uid } = this.props;
    firebase.user(uid).once('value', snapshot => this.setState({ user: snapshot.val() },
      this.fetchJobs));
  }

  fetchJobs() {
    const { firebase } = this.props;
    const { user } = this.state;

    firebase.allJobs().on('value', snapshot => {
      const jobs = snapshot.val();
      console.log('boys, boys boys', jobs);

      if (!jobs) {
        this.setState({
          loading: false
        });
        return;
      }

      const jobsList = Object.keys(jobs)
        .map(key => ({ ...jobs[key], uid: key }))
        .filter(item => item.username === user.username)
        .reverse();

      this.setState({
        jobs: jobsList,
        loading: false
      });

      console.log('state', this.state);

      // There must be a better way to do this instead of re-traversing the
      // returned array and assigning the snippets to it.
      // jobsList.forEach(job => {
      //   const port = process.env.REACT_APP_ENV === 'production' ? '' : 9090;
      //   const url = process.env.REACT_APP_ENV === 'production'
      //     ? `${ window.location.protocol }//${ window.location.hostname }`
      //     : `${ window.location.protocol }//${ window.location.hostname }:${ port }`;
      //
      //   fetch(`${ url }/api/snippet?user=${ job.username }&job=${ job.slug }`, {
      //     method: 'GET',
      //     headers: {
      //       'Content-Type': 'application/json',
      //       'Accept': 'application/json'
      //     }
      //   })
      //     .then(response => response.text())
      //     .then(snapshot => {
      //     job.snippet = snapshot ? snapshot + '...' : '';
      //   })
      //     .then(() => {
      //       this.setState({
      //         jobs: jobsList,
      //         loading: false
      //       });
      //     })
      //     .catch(() => {
      //       this.setState({
      //         jobs: jobsList,
      //         loading: false
      //       });
      //     });
      // });
    });
  }

  // Adds and removes jobs to the delete queue.
  handleJobCheck(e) {
    if (e.target.type === 'checkbox' && e.target.checked) {
      if (this.state.selectedJobs && !this.state.selectedJobs.includes(e.target.name)) {
        this.setState({
          selectedJobs: [...this.state.selectedJobs, e.target.name]
        });
      }
    } else {
      this.setState({
        selectedJobs: this.state.selectedJobs.filter(job => job !== e.target.name)
      });
    }
  }

  handleDownloadJobs(e) {
    const { selectedJobs } = this.state;

    e.preventDefault();

    selectedJobs.forEach(job => {
      fetchTranscript(job.split(',')[2], job.split(',')[1])
        .then(() => console.log('success!'))
        .catch(err => console.error('Failed to fetch the transcript file: ' + err));
    });
  }

  handleDeleteJobs(e) {
    const { firebase } = this.props;
    const { selectedJobs } = this.state;

    e.preventDefault();

    selectedJobs.forEach(job => {
      this.setState({
        jobs: this.state.jobs.filter(item => item.uid !== job.split(',')[0])
      });

      firebase.deleteJobFromJobs(job.split(',')[0]);
      firebase.deleteJobFromUser(job.split(',')[1]);
      JobList.deleteShareDbJob(job.split(',')[2], job.split(',')[1]);
    });
  }

  static deleteShareDbJob(user, job) {
    const url = `${ window.location.protocol }//${ window.location.hostname }`;
    return fetch(`${ url }/api?user=${ user }&job=${ job }`, {
      method: 'delete'
    }).then(response => response.json());
  }

  render() {
    library.add(faEdit);
    const { jobs, loading } = this.state;

    return (
      <div>
        { !loading
          ? jobs && jobs.length === 0
            ? <Card className="card-tasks recent-jobs-card">
              <CardHeader>
                <h4 className="title d-inline text-primary">RECENT JOBS</h4>
                {/*<p className="card-category d-inline"> today</p>*/ }
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      disabled
                      href="#"
                      onClick={ e => this.handleDownloadJobs(e) }>
                      <i className="tim-icons icon-cloud-download-93" />&nbsp;&nbsp;
                      Download Transcription File
                    </DropdownItem>
                    <DropdownItem
                      disabled
                      href="#"
                      onClick={ e => this.handleDeleteJobs(e) }>
                      <i className="tim-icons icon-simple-remove" />&nbsp;&nbsp;
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <p>
                        <em>No jobs yet...</em>
                      </p>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
            : <Card className="card-tasks recent-jobs-card">
              <CardHeader>
                <h4 className="title d-inline text-primary">RECENT JOBS</h4>
                {/*<p className="card-category d-inline"> today</p>*/ }
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      href="#"
                      onClick={ e => this.handleDownloadJobs(e) }>
                      <i className="tim-icons icon-cloud-download-93" />&nbsp;&nbsp;
                      Download Transcription File
                    </DropdownItem>
                    <DropdownItem
                      href="#"
                      onClick={ e => this.handleDeleteJobs(e) }>
                      <i className="tim-icons icon-simple-remove" />&nbsp;&nbsp;
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                    <ListOfJobs
                      handleJobCheck={ this.handleJobCheck }
                      jobs={ jobs }
                      hidden={ !jobs || jobs.length === 0 } />
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          : <p className="text-center"><em>Loading...</em></p>
        }
      </div>
    );
  }
}

const ListOfJobs = ({ handleJobCheck, jobs }) =>
  <>
    { !!jobs && jobs.map(job => (
      <tr key={ job.uid }>
        <td>
          <FormGroup check>
            <div className="custom-control custom-checkbox d-inline">
              <Input
                key={ job.uid }
                name={ `${ job.uid },${ job.slug },${ job.username }` }
                id={ `${ job.uid },${ job.slug },${ job.username }` }
                type="checkbox"
                onChange={ e => handleJobCheck(e) }
                className="custom-control-input" />
              <Label className="custom-control-label" for={ `${ job.uid },${ job.slug },${ job.username }` } check />
            </div>
          </FormGroup>
        </td>
        <td>
          <p className="title text-primary recent-jobs--card-title">{ job.title ? job.title : job.slug }</p>
          <small className="job-date text-muted">{ new Date(job.timeCreated).toLocaleString() }</small>
          <br />
          <small>{ job.slug }</small>
          <p className="mt-3">
            { job.snippet ? job.snippet : <em>This job has no preview.</em> }
          </p>
        </td>
        <td className="td-actions text-right">
          <Link
            color="link"
            id="tooltip636901683"
            title=""
            type="button"
            to={ `/editor?user=${ job.username }&job=${ job.slug }` }>
            <FontAwesomeIcon icon="edit" />
          </Link>
          <UncontrolledTooltip
            delay={ 0 }
            target="tooltip636901683"
            placement="right"
          >
            Edit Job
          </UncontrolledTooltip>
        </td>
      </tr>
    )) }
  </>;

JobList.propTypes = {};

export default withFirebase(JobList);
