// Main component that shows the appropriate component based on
// transcript access properties or availability.
// It checks to make sure that the event exists in database and whatnot.

import React from 'react';
import { withFirebase } from '../Firebase';
import TranscriptContainer from './TranscriptContainer';
import { css } from 'react-emotion';
import { BarLoader } from 'react-spinners';
import './index.css';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const mapStateToProps = state => {
  return {
    style: state.aloft_localstorage.style
  };
};

const override = css`
    display: block;
    margin: 0 auto;
    color: style.color;
`;

class ConnectedIndex extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      job: {},
      jobId: '',
      loading: true,
      user: ''
    };

    this.docParams = this.props.match.params;
  }

  componentDidMount() {
    const { firebase } = this.props;

    firebase.findUser(this.docParams.user.toLowerCase()).once('value', snapshot => {
      if (!snapshot.val()) {
        return this.setState({ loading: false });
      }

      const returnedUser = snapshot.val();
      const user = Object.keys(returnedUser).map(key => ({
        ...returnedUser[key]
      }));

      if (!user[0].jobs[this.docParams.job.toLowerCase()]) {
        return this.setState({ loading: false });
      }

      this.setState({
        user: user[0].username.toLowerCase(),
        jobId: user[0].jobs[this.docParams.job.toLowerCase()].id
      });

      return this.findJob();
    });
  }

  findJob() {
    const { firebase } = this.props;
    const { jobId } = this.state;

    firebase.jobById(jobId).once('value', snapshot => {
      if (!snapshot.val()) {
        return;
      }
      const returnedJob = snapshot.val();

      this.setState({
        job: returnedJob,
        loading: false
      });
    });
  }

  render() {
    const { job, jobId, loading, user } = this.state;
    const { style } = this.props;

    document.title = job.title;

    if (job.completed) {
      return <Redirect push
                       to={ {
        pathname: ROUTES.DOC,
        state: { from: this.props.location },
        search: `?user=${ user }&job=${ job.slug }`
      } }
      />;
    }

    return (
      <div style={ { backgroundColor: style.backgroundColor } }>
        {
          !loading
            ? job && jobId && job.privacy === true
            ? <p>this is a private event.</p>
            : job && jobId
              ? <TranscriptContainer
                className="transcript--main-container"
                user={ user }
                job={ job }
                style={ style }
              />
              : <p>No event found with that user/job combination!</p>
            : <div className="sweet-loading">
              <BarLoader
                css={ override }
                sizeUnit={ 'px' }
                size={ 13 }
                margin={ '6px' }
                loading={ loading }
              />
            </div>
        }
      </div>
    );
  }
}

const Index = connect(mapStateToProps, {})(ConnectedIndex);
export default withFirebase(Index);
