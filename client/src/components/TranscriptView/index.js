import React from 'react';
import { withFirebase } from '../Firebase';
import Viewer from './Viewer';
import { css } from 'react-emotion';
import { SyncLoader } from 'react-spinners';
import './index.css';
import Private from '../Placeholders/Private';
import HasntStarted from '../Placeholders/HasntStarted';
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

    firebase.findUser(this.docParams.user).once('value', snapshot => {
      if (!snapshot.val()) {
        return this.setState({ loading: false });
      }

      const returnedUser = snapshot.val();
      const user = Object.keys(returnedUser).map(key => ({
        ...returnedUser[key]
      }));

      if (!user[0].jobs[this.docParams.job]) {
        return this.setState({ loading: false });
      }

      this.setState({
        user: user[0].username,
        jobId: user[0].jobs[this.docParams.job].id
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
  };

  render() {
    const { job, jobId, loading } = this.state;
    const { style } = this.props;

    return (
      <>
        { !loading
          ?
          job && jobId && job.privacy === true
            ? <p>this is a private event.</p>
            : job && jobId
            ? <Viewer user={ this.docParams.user } job={ this.docParams.job } style={ style } />
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
