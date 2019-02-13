import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faArrowDown,
  faKeyboard,
  faServer
} from '@fortawesome/free-solid-svg-icons';
import Navigation from '../Navigation';
import { Col, Container, Row } from 'reactstrap';
import './index.scss';

const Index = () => {
  library.add(
    faArrowDown,
    faKeyboard,
    faServer
  );
  return (
    <div>
      <Navigation />
      <Container>
        <section className="mt-10">
          <Row>
            <h2>Realtime Captioning, live transcription <em>simplified</em>.</h2>
            <Col lg={ 6 } md={ 6 } sm={ 12 } className="about--section-textbox">
              <p className="mt-4">
                <h3>What is Upwordly?</h3>
                <strong>Upwordly</strong> is a real-time transcription delivery tool and a content management system (CMS) for real-time
                stenographers. You login, create a job, connect your CAT software via a small helper app, and start
                writing.
                Distribute your live feed to anyone via a short URL and that's it! Since it is web based, there's no
                need
                for
                your consumers to install anything on their end. When the job is over, it's your choice to use the
                variety
                of
                tools to save or disseminate the transcript or to delete it. Simple.
              </p>
              <a href="https://www.youtube.com/watch?v=PtlriHufTBA"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-success">See how easy it is to connect your CAT software to Upwordly</a>
            </Col>
            <Col lg={ 6 } md={ 6 } sm={ 12 }>
              <div className="mt-4">
                <Row className="mt-3">
                  <Col sm={12} className="text-center">
                  <FontAwesomeIcon icon="keyboard" className="about--section-demo-icon" />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col sm={12} className="text-center">
                  <FontAwesomeIcon icon="arrow-down" className="about--section-demo-icon" />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col sm={12} className="text-center">
                    <FontAwesomeIcon icon="server" className="about--section-demo-icon" />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </div>
  );
};

export default Index;
