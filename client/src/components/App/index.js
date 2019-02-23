import React from 'react';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';

import { withAuthentication } from '../Session';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordChangePage from '../PasswordChange';
import PasswordForgetPage from '../PasswordForget';
import AboutPage from '../About';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import DashboardPage from '../Dashboard';
import Doc from '../Doc';
import TranscriptEditor from '../Editor';
import TranscriptView from '../View';
import TranscriptViewTools from '../ViewTools';
import * as ROUTES from '../../constants/routes';

const App = () =>
  <Router>
    <div>
      <Route path={ ROUTES.ACCOUNT } component={ AccountPage } />
      <Route path={ ROUTES.ABOUT } component={AboutPage} />
      <Route path={ ROUTES.ADMIN } component={ AdminPage } />
      <Route path={ ROUTES.DASHBOARD } component={ DashboardPage } />
      <Route path={ ROUTES.DOC } component={ Doc } />
      <Route exact path={ ROUTES.LANDING } component={ LandingPage } />
      <Route path={ ROUTES.SIGN_UP } component={ SignUpPage } />
      <Route path={ ROUTES.SIGN_IN } component={ SignInPage } />
      <Route path={ ROUTES.PASSWORD_CHANGE } component={ PasswordChangePage } />
      <Route path={ ROUTES.PASSWORD_FORGET } component={ PasswordForgetPage } />
      <Route path={ ROUTES.TRANSCRIPT_VIEW_TOOLS } component={ TranscriptViewTools } />
      <Route path={ ROUTES.TRANSCRIPT_EDITOR } component={ TranscriptEditor } />
      <Route path="/:user/:job" component={ TranscriptView } />
    </div>
  </Router>;

export default withAuthentication(App);
