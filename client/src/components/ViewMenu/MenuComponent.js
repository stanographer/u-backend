import React, { Fragment } from 'react';
import {
  Button,
  Nav,
  NavbarBrand,
  NavItem,
  NavLink,
} from 'reactstrap';
import styled from 'styled-components';
import { fetchTranscript } from '../Dashboard/downloadTranscript';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Header = styled.header`
  align-items: center;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const MenuComponent = (props) => {
  library.add(faDownload);
  console.log(props);

  return (
    <Fragment>
      <NavbarBrand className="flyoutMenu--navbar-brand">Upwordly</NavbarBrand>
      <Nav className="ml-auto">
        <NavItem>
          <NavLink href="#">Link</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">
            <FontAwesomeIcon icon="download" />
            &nbsp;
            Download
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#" className="btn btn-primary" onClick={() => props.scrollDown()}>Autoscrolling Off</NavLink>
        </NavItem>
        <NavItem>
          <NavLink href="#">
            <Button close
                    className="close"
                    aria-label="Close"
                    onClick={ e => props.handleOpenMenu(e) }>
            </Button>
          </NavLink>
        </NavItem>
      </Nav>
    </Fragment>
  );
};

export default MenuComponent;
