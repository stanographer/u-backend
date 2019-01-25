import React from 'react';
import PropTypes from 'prop-types';
import { withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';
import {
  Col,
  Container,
  Row
} from 'reactstrap';
import Navigation from '../Navigation';
import { compose } from 'recompose';
import { withRouter, Redirect } from 'react-router-dom';
import JobCreator from './JobCreator';
import JobList from './JobList';
import './index.css';
import Footer from '../Footer';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: '1',
      user: {},
      uid: ''
    };

    this.toggleTab = this.toggleTab.bind(this);
  }

  componentDidMount() {
    document.title = 'Upwordly Dashboard';
    const { firebase } = this.props;

    firebase.user(firebase.auth.currentUser.uid).once('value', snapshot => {
      const userSnapshot = snapshot.val();
      this.setState({
        user: {
          ...userSnapshot,
          uid: firebase.auth.currentUser.uid
        }
      });
    });
  }

  toggleTab(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    const { user } = this.state;
    const { firebase } = this.props;

    return (
      <div>
        <Navigation user={ user } />
        <Container className="container clear-navbar-footer">
          <Row>
            <Col lg="6" md="12">
              <JobCreator user={ user } />
            </Col>
            <Col lg="6" md="12">
              <JobList user={ user } uid={ firebase.auth.currentUser.uid } />
            </Col>
          </Row>
        </Container>
        <Footer />
      </div>
    );
  }
}

Dashboard.propTypes = {
  firebase: PropTypes.object
};

const condition = authUser => !!authUser;

export default compose(withRouter, withFirebase, withAuthorization(condition))(Dashboard);
