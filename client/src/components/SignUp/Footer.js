import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { PasswordForgetLink } from '../PasswordForget';
import { SignUpLink } from './backup';

const Footer = () => {
  return (
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
              <li><PasswordForgetLink /></li>
              <li><SignUpLink /></li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
