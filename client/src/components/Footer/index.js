import React from 'react';
import { Col, Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-mustard text-primary py-5">
      <Container className="py-5">
        <Row>
          <Col lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 } className="mb-2 footer--section-header">
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
          <Col lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 } className="mb-2 footer--section-header">
            <h6 className="text-header">Company</h6>
            <ul className="nav flex-column footer--list-items">
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>About us</Link>
              </li>
            </ul>
          </Col>
          <Col lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 } className="mb-2 footer--section-header">
            <h6 className="text-header">Features</h6>
            <ul className="nav flex-column footer--list-items">
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>Live Transcription Anywhere</Link>
              </li>
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>Repository</Link>
              </li>
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>Delivery</Link>
              </li>
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>Analytics</Link>
              </li>
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>API</Link>
              </li>
            </ul>
          </Col>
          <Col lg={ 3 } md={ 6 } sm={ 12 } xs={ 12 } className="mb-2 footer--section-header">
            <h6 className="text-header">Support</h6>
            <ul className="nav flex-column footer--list-items">
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>Contact</Link>
              </li>
              <li>
                <Link className="text-light-brown" to={ ROUTES.ABOUT }>FAQs</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
