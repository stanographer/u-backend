import React from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import {
  Alert, Button,
  Col,
  Container,
  Form,
  Row
} from 'reactstrap';

import * as ROUTES from '../../constants/routes';
import Typed from 'react-typed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faCheck } from '@fortawesome/free-solid-svg-icons';
import { validateEmail, validatePassword } from './validations';
import StepZero from './StepZero';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import _ from 'lodash';

class SignUp extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: '',
      nickName: '',
      username: '',
      usernameFound: false,
      email: '',
      emailValid: false,
      emailFound: false,
      passwordOne: '',
      passwordTwo: '',
      passwordStrength: {},
      privilegeLevel: '',
      regKey: '',
      regKeyValid: false,
      error: '',
      step: 0
    };
    this.checkFbEmail = this.checkFbForEmail.bind(this);
    this.checkFbEmail = _.debounce(this.checkFbForEmail, 1000);

    this.checkFbUsername = this.checkFbForUsername.bind(this);
    this.checkFbUsername = _.debounce(this.checkFbForUsername, 1000);
  }

  componentWillUnmount() {
    if (this.props.firebase) this.props.firebase.users().off();
    this.checkFbEmail.cancel();
  }

  checkFbForEmail = () => {
    this.props.firebase.users()
      .orderByChild('email')
      .equalTo(this.state.email)
      .once('value', snapshot => {
        // If the snapshot is null, that means there's no users! So allow user to sign up.
        if (snapshot.val()) {
          this.setState({
            emailFound: true
          });
        } else {
          this.setState({
            emailFound: false
          });
        }
      }).catch(err => console.log('error! ' + err));
  };

  checkFbForUsername = () => {
    this.props.firebase.users()
      .orderByChild('username')
      .equalTo(this.state.username)
      .once('value', snapshot => {
        // If the snapshot is null, that means there's no users! So allow user to sign up.
        if (snapshot.val()) {
          this.setState({
            usernameFound: true
          });
        } else {
          this.setState({
            usernameFound: false
          });
        }
      }).catch(err => console.log('error! ' + err));
  };

  finishStep = () => {
    this.setState({
      step: this.state.step + 1
    });

  };

  onChange = event => {
    console.log(this.state);

    if (event.target.name === 'passwordOne') {
      this.setState({
        passwordStrength: validatePassword(event.target.value)
      });
    }
    if (event.target.name === 'email') {
      this.setState({
        emailValid: validateEmail(event.target.value)
      });
      this.checkFbEmail();
    }
    if (event.target.name === 'username') {
      this.checkFbUsername();
    }
    if (event.target.name === 'regKey') {
      this.setState({
        regKeyValid: event.target.value === process.env.REACT_APP_REG_KEY
      });
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  onSubmit = event => {
    const {
            fullName,
            nickName,
            username,
            email,
            passwordOne,
            privilegeLevel,
            regKeyValid
          } = this.state;

    if (regKeyValid) {
      this.props.firebase
        .doCreateUserWithEmailAndPassword(email, passwordOne)
        .then(authUser => {
          return this.props.firebase
            .user(authUser.user.uid)
            .set({
              fullName: fullName.trim(),
              nickName: nickName.trim(),
              username: username.trim().toLowerCase(),
              email: email.trim().toLowerCase(),
              privilegeLevel
            });
        })
        .then(authUser => {
          this.props.history.push(ROUTES.DASHBOARD);
        })
        .catch(error => {
          this.setState({ error });
        });
    } else {
      this.setState({
        error: 'Sorry. Your registration token was declined.'
      });
    }
    event.preventDefault();
  };

  render() {
    library.add(faArrowRight, faCheck);

    return (
      <div className="pt-6 h-100-vh bg-mustard">
        <Container>
          <Row>
            <Col sm={ 12 }>
              <div className="mb-8">
                <h2 className="login--form-header">Upwordly</h2>
                <p className="login--form-welcome my-2">
                  <Typed strings={ ['Welcome to Upwordly!', 'Let\'s get signed up!'] }
                         typeSpeed={ 40 } />
                </p>
              </div>
            </Col>
          </Row>
          <div className="mb-8" />
          <Row>
            <Col sm={ 8 }>
              { this.state.error && <Alert color="danger" className="mb-5">
                { this.state.error.message }
              </Alert> }
              <Form onSubmit={ this.onSubmit }>
                {
                  this.state.step === 0
                    ? <StepZero onChange={ this.onChange }
                                regKey={ this.state.regKey }
                                regKeyValid={ this.state.regKeyValid }
                                finishStep={ this.finishStep } />
                    : ''
                }
                {
                  this.state.step === 1
                    ? <StepOne onChange={ this.onChange }
                               fullName={ this.state.fullName }
                               nickName={ this.state.nickName }
                               finishStep={ this.finishStep } />
                    : ''
                }
                {
                  this.state.step === 2
                    ? <StepTwo onChange={ this.onChange }
                               checkFbForEmail={ this.checkFbForEmail }
                               checkFbForUser={ this.checkFbForUser }
                               emailValid={ this.state.emailValid }
                               emailFound={ this.state.emailFound }
                               username={ this.state.username }
                               usernameFound={ this.state.usernameFound }
                               finishStep={ this.finishStep } />
                    : ''
                }
                {
                  this.state.step === 3
                    ? <>
                      <StepThree onChange={ this.onChange }
                                 passwordOne={ this.state.passwordOne }
                                 passwordTwo={ this.state.passwordTwo }
                                 passwordStrength={ this.state.passwordStrength }
                                 privilegeLevel={ this.state.privilegeLevel }
                                 finishStep={ this.finishStep } />
                      <Button
                        className="btn btn-success float-right mt-4"
                        size="lg"
                        valid={ this.state.passwordStrength.strength === 'strong' && this.state.passwordOne === this.state.passwordTwo }
                        onClick={ this.onSubmit }
                        type="submit">
                        Create Account&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon="check" />
                      </Button>
                    </>
                    : ''
                }
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const SignUpLink = () => (
  <>
    Don't have an account? <Link to={ ROUTES.SIGN_UP }>Sign Up</Link>
  </>
);

const SignUpForm = compose(withRouter, withFirebase)(SignUp);
export default SignUpForm;
export {
  SignUpLink
};
