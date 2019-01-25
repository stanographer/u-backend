import React from 'react';
import { withFirebase } from '../Firebase';
import TranscriptContainer from './TranscriptContainer';
import { css } from 'react-emotion';
import { SyncLoader } from 'react-spinners';
import './index.css';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    style: state.aloft_localstorage.style
  };
};

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
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

  componentWillMount() {
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
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
      console.log('the user is using mobile');
    }
    const { job, jobId, loading, user } = this.state;
    const { style } = this.props;

    return (
      <>
        { !loading
          ?
          job && jobId && job.privacy === true
            ? <p>this is a private event.</p>
            : job && jobId
            ? <TranscriptContainer
                user={ user }
                job={ job.slug }
                style={ style } />
            : <p>No event found with that user/job combination!</p>
          : <div className='sweet-loading'>
            <SyncLoader
              className={ override }
              sizeUnit={ 'px' }
              size={ 13 }
              margin={ '6px' }
              color={ style.color }
              loading={ loading }
            />
          </div>
        }
      </>
    );
  }
}

const Index = connect(mapStateToProps, {})(ConnectedIndex);
export default withFirebase(Index);
