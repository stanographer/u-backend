import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardDeck,
  CardImg,
  CardSubtitle,
  CardText,
  CardTitle,
  Container,
  Row
} from 'reactstrap';
import Navigation from '../Navigation/NavigationNonAuth';
import Typed from 'react-typed';

const App = () => (
  <>
    <Navigation />
    <header className="bg-primary">
      <Container className="h-100">
        <Row className="h-100">
          <div className="col-12">
            <div className="text-center m-0 vh-100 d-flex flex-column justify-content-center text-light">
              <h1 className="display-4">Upwordly</h1>
              <p className="lead header--typed-text"><Typed
                strings={ ['Web-based live stenography, simplified.'] }
                typeSpeed={ 40 }
              /></p>
              <div className="mt-2">
                <div className="btn-group-lg">
                  <a href="#" className="btn btn-outline-light btn-lg">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        </Row>
      </Container>
    </header>
    <section className="container mt-10">
      <h1 className="text-center mt-4">About Upwordly</h1>
      <p className="mt-4">
        Upwordly is a real-time transcription delivery tool and a content management system (CMS) for real-time
        stenographers. You login, create a job, connect your CAT software via a small helper app, and start writing.
        Distribute your live feed to anyone via a short URL and that's it! Since it is web based, there's no need for
        your consumers to install anything on their end. When the job is over, it's your choice to use the variety of
        tools to save or disseminate the transcript or to delete it. Simple.
      </p>
    </section>
    <section className="container mt-10">
      <CardDeck>
        <Card>
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="d-flex flex-column justify-content-center align-items-center">
            <h1 className="display-2 text-primary">
              <i className="tim-icons icon-tablet-2" />
            </h1>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>This card has supporting text below as a natural lead-in to additional content.</CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle>Card title</CardTitle>
            <CardSubtitle>Card subtitle</CardSubtitle>
            <CardText>This is a wider card with supporting text below as a natural lead-in to additional content. This card has even longer content than the first to show that equal height action.</CardText>
            <Button>Button</Button>
          </CardBody>
        </Card>
      </CardDeck>
    </section>
  </>
);

export default App;
