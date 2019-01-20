import React from 'react';
import{
  Button
} from 'reactstrap';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase }) => (
  <Button type="button"
          className="btn btn-outline-light btn-md btn-primary"
          onClick={ firebase.doSignOut }>
    Sign Out
  </Button>
);

export default withFirebase(SignOutButton);
