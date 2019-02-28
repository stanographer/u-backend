import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CardText,
  Col,
  Row,
} from 'reactstrap';
import { fetchTranscript } from '../Dashboard/downloadTranscript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { MenuParticle } from '../MenuParticle';
import FontFamilyMenu from './FontFamilyMenu';
import FontSizeMenu from './FontSizeMenu';

const MenuComponent = (props) => {
  const {
          visibility,
          job,
          backgroundColor,
          color,
          fontSize,
          lineHeight,
          textTransform,
          textShadow,
          fontFamily,
          style,
          onFontSizeChange,
          onStyleChange,
        } = props;

  library.add(faArrowDown, faDownload);
  console.log(props);

  return (
    <Row>
      <Col sm={ 12 }>
        <MenuParticle>
          <Button className="btn btn-primary" onClick={ () => props.scrollDown() }>
            <FontAwesomeIcon icon="arrow-down" />&nbsp;
            Scroll to Bottom
          </Button>
        </MenuParticle>
        <MenuParticle title={ job.title ? job.title : job.slug }>
          <CardText>
            <strong>SPEAKER(S):</strong> { job.speakers ? job.speakers : 'None designated' }<br /><br />
            <strong>STENOGRAPHER: </strong> { job.userFullName }
            <br />
            <br />
          </CardText>
        </MenuParticle>
        <MenuParticle title="VIEW OPTIONS" class="mt-2">
          <Fragment>
            <FontFamilyMenu fontFamily={ props.style.fontFamily } onStyleChange={ onStyleChange } />
            <FontSizeMenu onFontSizeChange={ onFontSizeChange } fontSize={ style.fontSize } />
          </Fragment>
        </MenuParticle>
        <Button close
                className="close"
                aria-label="Close"
                onClick={ e => props.handleOpenMenu(e) }>
        </Button>
      </Col>
    </Row>
  );
};

MenuComponent.propTypes = {
  handleOpenMenu: PropTypes.func,
  job: PropTypes.object,
  onStyleChange: PropTypes.func,
  style: PropTypes.object,
};

export default MenuComponent;
