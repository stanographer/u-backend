import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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
import './index.css';

const SignInPage = () => (
  <div className="login__form">
    <Container>
      <Row>
        <Col md={ 3 } />
        <Col md={ 6 }>
          <h2 className="login__form-header">Upwordly</h2>
          <SignInForm />
          <PasswordForgetLink />
          <SignUpLink />
        </Col>
        <Col md={ 3 } />
      </Row>
    </Container>
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
            <Label for="email" sm={ 4 } size="lg">Email</Label>
            <Col sm={ 8 }>
              <Input
                required
                value={ email }
                onChange={ this.onChange }
                type="email"
                name="email"
                id="email"
                bsSize="lg" />
              <span className="floating-label">Your email address</span>
            </Col>
          </FormGroup>
          <FormGroup row>
            <Label for="password" sm={ 4 } size="lg">Password</Label>
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

export default SignInPage;

export { SignInForm };
