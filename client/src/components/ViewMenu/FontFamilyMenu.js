import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Label,
  UncontrolledDropdown
} from 'reactstrap';

function FontFamilyMenu(props) {
  const {
          fontFamily,
          onStyleChange
        } = props;

  return (
    <FormGroup row>
      <Label for="fontFamily" sm={ 6 }>Font family</Label>
      <Col sm={ 6 }>
        <UncontrolledDropdown>
          <DropdownToggle color="primary" caret block style={ { fontFamily } }>
            { fontFamily.split(',')[0] }
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem header>Regular</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Comfortaa, sansSerif' } }
                          id="fontFamily"
                          value="Comfortaa, sansSerif"
                          onClick={ e => onStyleChange(e) }>Comfortaa</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Cousine, monospace' } }
                          id="fontFamily"
                          value="Cousine, monospace"
                          onClick={ e => onStyleChange(e) }>Cousine</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Input Mono, sansSerif' } }
                          id="fontFamily"
                          value="Montserrat, sansSerif"
                          onClick={ e => onStyleChange(e) }>Montserrat</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Montserrat, sansSerif' } }
                          id="fontFamily"
                          value="Montserrat, sansSerif"
                          onClick={ e => onStyleChange(e) }>Montserrat</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Nunito, sansSerif' } }
                          id="fontFamily"
                          value="Nunito, sansSerif"
                          onClick={ e => onStyleChange(e) }>Nunito</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Poppins, sansSerif' } }
                          id="fontFamily"
                          value="Poppins, sansSerif"
                          onClick={ e => onStyleChange(e) }>Poppins</DropdownItem>
            <DropdownItem divider />
            <DropdownItem header>Monospaced</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Inconsolata, monospace' } }
                          id="fontFamily"
                          value="Inconsolata, monospace"
                          onClick={ e => onStyleChange(e) }>Inconsolata</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Input Mono, sansSerif' } }
                          id="fontFamily"
                          value="Input Mono, sansSerif"
                          onClick={ e => onStyleChange(e) }>Input Mono</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Input Mono Light, sansSerif' } }
                          id="fontFamily"
                          value="Input Mono Light, sansSerif"
                          onClick={ e => onStyleChange(e) }>Input Mono Light</DropdownItem>
            <DropdownItem style={ { fontFamily: 'Ubuntu Mono, monospace' } }
                          id="fontFamily"
                          value="Ubuntu Mono, monospace"
                          onClick={ e => onStyleChange(e) }>Ubuntu Mono</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Col>
    </FormGroup>
  );
}

FontFamilyMenu.propTypes = {
  fontFamily: PropTypes.string,
  onStyleChange: PropTypes.func
};

export default FontFamilyMenu;
