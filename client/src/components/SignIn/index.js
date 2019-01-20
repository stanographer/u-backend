import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import {
  Button,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  UncontrolledAlert
} from 'reactstrap';
import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from '../SignUp';
import * as ROUTES from '../../constants/routes';
import Typed from 'react-typed';
import './index.css';

import { AuthUserContext } from '../Session';

const SignIn = (props) => (
  <AuthUserContext.Consumer>
    { authUser => authUser
      ?  <Redirect to="/dashboard" {...props} />
      : <SignInPage /> }
  </AuthUserContext.Consumer>
);

const SignInPage = () => (
  <div className="login__form h-100-vh bg-mustard">
    <Container>
      <Row>
        <Col md={ 3 } />
        <Col md={ 6 }>
          <div className="mb-4">
            <h2 className="login--form-header">Upwordly</h2>
            <p className="login--form-welcome my-2">
              <Typed strings={ ['Welcome back!'] }
                     typeSpeed={ 40 } />
            </p>
          </div>
          <SignInForm />
        </Col>
        <Col md={ 3 } />
      </Row>
    </Container>
    <footer className="bg-mustard text-primary pt-5 mt-5">
      <Container className="pt-5">
        <Row>
          <Col lg={ 6 } md={ 6 } sm={ 12 } className="mb-2 footer--section-header">
            <h5 className="text-uppercase text-header">Upwordly</h5>
            <p>
              <small>
                &copy;2019 Upwordly, LLC.
                <br />
                All rights reserved.
              </small>
            </p>
            <p>
              <small>Proudly built in NYC. &hearts;</small>
            </p>
          </Col>
          <Col lg={ 6 } md={ 6 } sm={ 12 } className="mb-2 footer--section-header">
            <h4 className="text-header pb-3 text-strong">Need help?</h4>
            <ul className="nav flex-column footer--list-items">
              <li><Link to={ ROUTES.LANDING }>Back to Landing Page</Link></li>
              <li><PasswordForgetLink /></li>
              <li><SignUpLink /></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password).then(() => {
      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.DASHBOARD);
    }).catch(error => {
      this.setState({ error });
    });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <div>
        <Form onSubmit={ this.onSubmit }>
          <FormGroup row>
            <Label for="email" sm={ 4 } size="lg" className="text-primary text-strong">Email</Label>
            <Col sm={ 8 }>
              <Input
                required
                value={ email }
                onChange={ this.onChange }
                type="text"
                name="email"
                id="email"
                bsSize="lg" />
              <span className="floating-label">Your email address</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="password" sm={ 4 } size="lg" className="text-primary text-strong">Password</Label>
            <Col sm={ 8 }>
              <Input
                required
                value={ password }
                onChange={ this.onChange }
                type="password"
                name="password"
                id="password"
                bsSize="lg" />
              <span className="floating-label">Your password</span>
            </Col>
          </FormGroup>
          { error &&
          <UncontrolledAlert color="danger">
            { error.message }
          </UncontrolledAlert> }
          <Button
            className="btn btn-primary btn-lg mt-4"
            disabled={ isInvalid }
            type="submit"
            size="lg"
            block>
            Sign In
          </Button>
        </Form>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignIn;

export { SignInForm };
