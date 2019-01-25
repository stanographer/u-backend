import React from 'react';
import { Button, Col, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StepTwo = (props) => {
  console.log(props);
  return (
    <>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          size="lg"
          for="Email"
          sm={ 4 }>
          Email
        </Label>
        <Col sm={ 8 }>
          <Input
            autoFocus
            required
            bsSize="lg"
            type="text"
            name="email"
            id="email"
            valid={!!props.emailValid && !props.emailFound}
            invalid={!!props.emailFound}
            onChange={ props.onChange } />
          <span className="floating-label">Your email address</span>
          { !props.emailValid
            ? <FormFeedback invalid>The email is badly formatted.</FormFeedback>
            : ''
          }
          { props.emailFound
            ? <FormFeedback invalid>This email already has an account.</FormFeedback>
            : ''
          }
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          for="username"
          sm={ 4 }
          size="lg">
          Username
        </Label>
        <Col sm={ 8 }>
          <Input
            required
            className="text-primary text-strong"
            type="text"
            name="username"
            onChange={ props.onChange }
            id="username"
            bsSize="lg"
            valid={!props.usernameFound && !!props.username} />
          <span className="floating-label">Your username</span>
          { props.usernameFound
            ? <FormFeedback invalid>This username is already taken.</FormFeedback>
            : ''
          }
        </Col>
      </FormGroup>
      <Button
        className="btn btn-primary float-right"
        size="lg"
        onClick={ props.finishStep }
        disabled={!props.username || !props.emailValid}
        type="submit">
        Next step&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon="arrow-right" />
      </Button>
    </>
  );
};

export default StepTwo;
