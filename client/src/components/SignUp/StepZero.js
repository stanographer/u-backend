import React from 'react';
import { Button, Col, FormGroup, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StepZero = (props) => {
  return (
    <>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          for="Full Name"
          sm={ 4 }
          size="lg">Registration Token</Label>
        <Col sm={ 8 }>
          <Input
            autoFocus
            required
            bsSize="lg"
            onChange={ props.onChange }
            type="text"
            name="regKey"
            id="regKey"
            valid={ props.regKeyValid } />
          <span className="floating-label">Enter your registration key.</span>
        </Col>
      </FormGroup>
      <div className="mt-4" />
      <Button
        className="btn btn-primary float-right"
        size="lg"
        onClick={ props.finishStep }
        disabled={ !props.regKeyValid }
        type="submit">
        Next step&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon="arrow-right" />
      </Button>
    </>
  );
};

export default StepZero;
