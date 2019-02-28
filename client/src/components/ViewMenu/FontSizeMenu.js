import React from 'react';
import PropTypes from 'prop-types';
import {
  Col,
  FormGroup,
  Label
} from 'reactstrap';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function FontFamilyMenu(props) {
  const {
          fontSize,
          onFontSizeChange
        } = props;

  return (
    <FormGroup row>
      <Label for="fontSize" sm={ 6 }>Font size</Label>
      <Col sm={ 6 }>
        <Slider
          className="mt-2"
          id="fontSize"
          min={.1}
          max={10}
          step={.1}
          defaultValue={ fontSize && Number(fontSize.split('em')[0]) }
          onChange={ n => onFontSizeChange(n) }
        />
      </Col>
    </FormGroup>
  );
}

FontFamilyMenu.propTypes = {
  fontSize: PropTypes.string,
  onFontSizeChange: PropTypes.func,
};

export default FontFamilyMenu;
