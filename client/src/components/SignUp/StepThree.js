import React from 'react';
import { Alert, Button, Col, FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';

const StepThree = (props) => {
  return (
    <div>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          size="lg"
          for="passwordOne"
          sm={ 4 }>Password</Label>
        <Col sm={ 8 }>
          <Input
            type="password"
            name="passwordOne"
            id="passwordOne"
            placeholder="Password"
            bsSize="lg"
            onChange={ props.onChange }
            valid={ props.passwordStrength.strength === 'strong' }
            invalid={ props.passwordStrength.strength !== 'strong' && props.passwordOne.length > 0 }
          />
          <span className="floating-label">Your password</span>
          { props.passwordStrength.strength === 'strong'
            ? <FormFeedback valid>
              { props.passwordStrength.message }
            </FormFeedback>
            : null }
          { props.passwordStrength.strength === 'medium'
            ? <FormFeedback invalid="true">
              { props.passwordStrength.message }
            </FormFeedback>
            : null }
          { props.passwordStrength.strength === 'weak'
            ? <FormFeedback invalid="true">
              { props.passwordStrength.message }
            </FormFeedback>
            : null }
          <FormText>Passwords must be at least 6 characters long, 1 numeric character, and 1 special character
            (@,%,^,*, etc.).</FormText>
        </Col>
      </FormGroup>
      {/*End passwordOne form group*/ }
      {/*props.passwordTwo form group*/ }
      <FormGroup row>
        <Label
          autoFocus
          className="text-primary text-strong"
          for="passwordOne"
          sm={ 4 }
          size="lg">Confirm password</Label>
        <Col sm={ 8 }>
          <Input
            type="password"
            name="passwordTwo"
            id="passwordTwo"
            bsSize="lg"
            onChange={ props.onChange }
            valid={ props.passwordOne === props.passwordTwo && props.passwordTwo !== '' }
            invalid={ props.passwordOne !== props.passwordTwo && props.passwordTwo.length > 0 }
          />
          <span className="floating-label">Retype password to confirm</span>
          { props.passwordOne === props.passwordTwo
            ? <FormFeedback valid>
              Nice! Passwords are looking good!
            </FormFeedback>
            : null }
          { props.passwordOne !== props.passwordTwo
            ? <FormFeedback invalid="true">
              Confirmation password must match original.
            </FormFeedback>
            : null }
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          for="privilegeLevel"
          sm={ 4 }
          size="lg">Role</Label>
        <Col sm={ 8 }>
          <Input
            bsSize="lg"
            value={ props.privilegeLevel }
            onChange={ props.onChange }
            type="select"
            id="privilegeLevel"
            name="privilegeLevel">
            <option value="provider">Provider (stenographer)</option>
            <option value="consumer">Consumer</option>
            <option value="admin" disabled>Administrator</option>
          </Input>
        </Col>
      </FormGroup>
    </div>
  );
};

export default StepThree;
