import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { updateStyle, resetStyle } from '../../actions';
import { TwitterPicker } from 'react-color';
import MenuComponent from './MenuComponent';
import './index.css';

const mapStateToProps = state => {
  return {
    style: state.aloft_localstorage.style,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateStyle: (style) => dispatch(updateStyle(style)),
    resetStyle: () => dispatch(resetStyle()),
  };
};

class Menu extends React.Component {
  constructor(props) {
    super(props);

    this.onStyleChange = this.onStyleChange.bind(this);
    this.onColorChange = this.onColorChange.bind(this);
    this.onBackgroundColorChange = this.onBackgroundColorChange.bind(this);
  }

  onColorChange(e) {
    let stylePayload = {
      id: 'color',
    };

    stylePayload.value = e.hex;
    return this.props.updateStyle(stylePayload);
  }

  onBackgroundColorChange(e) {
    let stylePayload = {
      id: 'backgroundColor',
    };

    stylePayload.value = e.hex;
    return this.props.updateStyle(stylePayload);
  }

  onStyleChange(e) {
    let stylePayload = {};
    let val;

    stylePayload.id = e.target.id;

    if (e.target.id === 'fontSize' || 'lineHeight' || 'margin') {
      val = Math.abs(e.target.value);
      if (e.target.value && e.target.value > -1 && e.target.value < 100) {
        val += 'em';
      } else {
        val = '1em';
      }
    }

    if (e.target.id === 'fontFamily') {
      val = e.target.value;
    }

    if (e.target.id === 'textShadow') {
      if (e.target.checked) {
        val = '2px 2px #474a4f';
      } else {
        val = 'unset';
      }
    }

    if (e.target.id === 'textTransform') {
      if (e.target.checked) {
        val = 'uppercase';
      } else {
        val = 'unset';
      }
    }

    stylePayload.value = val;
    return this.props.updateStyle(stylePayload);
  }

  render() {
    const { visibility } = this.props;

    return (
      <Fragment>
        {
          visibility
            ? <MenuComponent { ...this.props } />
            : ''
        }
      </Fragment>
    );
  }
}

const TranscriptViewMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default TranscriptViewMenu;
