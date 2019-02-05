import React from 'react';
import { Button, Col, FormGroup, Input, Label } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StepOne = (props) => {
  console.log(props);
  return (
    <>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          for="Full Name"
          sm={ 4 }
          size="lg">Full Name</Label>
        <Col sm={ 8 }>
          <Input
            autoFocus
            required
            bsSize="lg"
            onChange={ props.onChange }
            type="text"
            name="fullName"
            id="fullName"
            valid={!!props.fullName} />
          <span className="floating-label">Your full name</span>
        </Col>
      </FormGroup>
      <FormGroup row>
        <Label
          className="text-primary text-strong"
          for="nickName"
          sm={ 4 }
          size="lg">Nickname</Label>
        <Col sm={ 8 }>
          <Input
            required
            bsSize="lg"
            onChange={ props.onChange }
            type="text"
            name="nickName"
            id="nickName"
            valid={!!props.nickName}/>
          <span className="floating-label">What would you like us to call you?</span>
        </Col>
      </FormGroup>
      <div className="mt-4" />
      <Button
        className="btn btn-primary float-right"
        size="lg"
        onClick={props.finishStep}
        disabled={ !props.fullName || !props.nickName }
        type="submit">
        Next step&nbsp;&nbsp;&nbsp;<FontAwesomeIcon icon="arrow-right" />
      </Button>
      </>
  );
};

export default StepOne;
