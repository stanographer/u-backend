import React from 'react';
import {
  Collapse, Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown
} from 'reactstrap';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import SignOutButton from '../SignOut';
import NavigationNonAuth from './NavigationNonAuth';

const Navigation = (props) => (
  <AuthUserContext.Consumer>
    { authUser => authUser
      ? <NavigationAuth {...props} />
      : <NavigationNonAuth /> }
  </AuthUserContext.Consumer>
);

class NavigationAuth extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  componentWillMount() {
    console.log(this.props);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { firstName, lastName } = this.props.user;
    return (
      <>
        <Navbar color="dark"
                className="navbar fixed-top navbar-dark bg-primary"
                expand="lg"
                fixed="true">
          <Container>
            <NavbarBrand href="/">UPWORDLY</NavbarBrand>
            <NavbarToggler onClick={ this.toggle } />
            <Collapse isOpen={ this.state.isOpen } navbar>
              <Nav className="ml-auto" navbar>
                <NavItem>
                  <NavLink href={ ROUTES.DASHBOARD }>Dashboard</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href={ ROUTES.REPO }>Repository</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href={ ROUTES.ACCOUNT }>Account</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Support
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      Download CAT Plugin
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem>
                      Email Support
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                <NavItem>
                  <SignOutButton />
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default Navigation;
