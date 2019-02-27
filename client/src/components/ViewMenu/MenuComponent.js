import React, { Fragment } from 'react';
import {
  Button, Card, CardText, CardTitle, Col, Row,
} from 'reactstrap';
import styled from 'styled-components';
import { fetchTranscript } from '../Dashboard/downloadTranscript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const Wrapper = styled.section`
  background: ghostwhite;
`;

const MenuComponent = (props) => {
  const { visibility, job } = props;
  library.add(faArrowDown, faDownload);
  console.log(props);

  return (
    <Row>
      <Col sm={ 12 }>
        <Card body className="no-bg">
          <Button className="btn btn-primary" onClick={ () => props.scrollDown() }>
            <FontAwesomeIcon icon="arrow-down" />&nbsp;
            Scroll to Bottom
          </Button>
        </Card>
        <Card body className="no-bg">
          <CardTitle>"{ job.title ? job.title : job.slug }"</CardTitle>
          <CardText>
            Speakers: <em>{ job.speakers ? job.speakers : 'None designated' }</em><br />
            Stenographer: <em>{ job.userFullName }</em>
            <br />
            <br />
          </CardText>
        </Card>

        <Button close
                className="close"
                aria-label="Close"
                onClick={ e => props.handleOpenMenu(e) }>
        </Button>
      </Col>
    </Row>
  );
};

export default MenuComponent;
