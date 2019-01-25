import React from 'react';
import {
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

class NavigationNonAuth extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
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
                  <NavLink href="#about">About</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#features">Features</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="#pricing">Pricing</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/signup">Sign Up</NavLink>
                </NavItem>
                <NavItem>
                  <a href="/signin" className="btn btn-outline-light btn-md">Sign In</a>
                </NavItem>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    );
  }
}

export default NavigationNonAuth;
