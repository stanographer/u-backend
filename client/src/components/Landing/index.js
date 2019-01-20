import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../constants/routes';
import {
  Button,
  Card,
  CardDeck,
  CardText,
  CardTitle,
  Col,
  Container,
  Row
} from 'reactstrap';
import Mockup from '../Mockup';
import Navigation from '../Navigation/NavigationNonAuth';
import Footer from '../Footer';
import Typed from 'react-typed';
import '../../assets/css/browserMockup.css';

const Landing = () => {
  return (
    <>
      <Navigation />
      <header className="bg-mustard">
        <Container className="h-100">
          <Row className="h-100">
            <Col lg={ 12 }>
              <div className="text-center m-0 vh-100 d-flex flex-column justify-content-center text-primary">
                <h1 className="display-4 header-main">Upwordly</h1>
                <p className="lead text-primary mt-2">
                  <Typed strings={ ['One platform to sync, send, and integrate your real-time transcriptions.', 'Web-based live stenography, anywhere.'] }
                         typeSpeed={ 40 }
                  /></p>
                <div className="mt-4">
                  <div className="btn-group-lg">
                    <a href="#about" className="btn btn-outline-dark btn-lg">Learn More</a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <div id="about" />
      <section className="container mt-10">
        <h1 className="text-center mt-4 section-header">About Upwordly</h1>
        <Row>
          <Col lg={ 6 } md={ 6 } sm={ 12 }>
            <p className="mt-4">
              Upwordly is a real-time transcription delivery tool and a content management system (CMS) for real-time
              stenographers. You login, create a job, connect your CAT software via a small helper app, and start
              writing.
              Distribute your live feed to anyone via a short URL and that's it! Since it is web based, there's no need
              for
              your consumers to install anything on their end. When the job is over, it's your choice to use the variety
              of
              tools to save or disseminate the transcript or to delete it. Simple.
            </p>
          </Col>
          <Col lg={ 6 } md={ 6 } sm={ 12 }>
            <div className="browser-mockup with-url">
              <div className="upwordly-mockup">
                <Mockup />
              </div>
            </div>
          </Col>
        </Row>
      </section>
      <div id="features" />
      <section className="container mt-10">
        <h1 className="text-center mt-4 mb-6 section-header">Send your live transcriptions to the cloud.</h1>
        <CardDeck>
          <Card body outline color="primary">
            <CardTitle className="text-primary card-title">
              Fast
            </CardTitle>
            <CardText>Utilizing distributed WebSockets connections ensures your viewers get text at nearly instantaneous
              speeds.</CardText>
          </Card>
          <Card body outline color="primary">
            <CardTitle className="text-primary card-title">
              Simple
            </CardTitle>
            <CardText>Web based means there's nothing to set up for your clients. You simply point them to a URL and
              your
              live transcription shows up in their browser.</CardText>
          </Card>
          <Card body outline color="primary">
            <CardTitle className="text-primary card-title">
              Versatile
            </CardTitle>
            <CardText>Upwordly offers stenographers not only the tools to make their realtime available anywhere; it
              makes
              saving, archiving, and sending transcripts a breeze.</CardText>
          </Card>
        </CardDeck>
      </section>
      <div id="pricing" />
      <section className="container mt-10">
        <h1 className="text-center mt-4 mb-6 section-header">Flexible Pricing</h1>
        <CardDeck>
          <Card body inverse className="bg-primary">
            <CardTitle>Single User</CardTitle>
            <CardText>You're a single freelancer and expect to use the service around 10 times per week.</CardText>
            <Button outline size="lg" className="btn btn-outline-light">$48 per month</Button>
          </Card> <Card body inverse className="bg-primary">
          <CardTitle>Agency</CardTitle>
          <CardText>You're an agency employing 2-10 writers and expect to use the service 10-30 times per week.</CardText>
          <Button outline size="lg" className="btn btn-outline-light">$98 per month</Button>
        </Card> <Card body inverse className="bg-primary">
          <CardTitle>Enterprise</CardTitle>
          <CardText>You have a large staff and clientele base with an average of over 30 uses per week.</CardText>
          <Button outline size="lg" className="btn btn-outline-light">$280 per month</Button>
        </Card>
        </CardDeck>
      </section>
      <section className="container mt-10">
      </section>
      <Footer />
    </>
  );
};

export default Landing;
