import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Binding from './react-binding';

export default class ShareDBBinding extends Component {
  static propTypes = {
    cssClass: PropTypes.string,
    cols: PropTypes.number,
    doc: PropTypes.object,
    elementType: PropTypes.string,
    onLoaded: PropTypes.func,
    rows: PropTypes.number,
    style: PropTypes.object,
    flag: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };
  }

  componentWillMount() {
    this.subscribe(this.props);
  }

  componentWillUnmount() {
    this.props.doc.unsubscribe();
    this.props.doc.destroy();
    this.binding = null;
  }

  subscribe(props) {
    const { doc, onLoaded } = props;

    doc.subscribe(err => {
      if (err) console.log(err);
      if (doc.type === null) {
        this.setState({
          error: 'No document with that user and event combination exists!'
        });
      }
    });

    doc.on('load', () => {
      this.binding = new Binding(doc.data, this.props.flag);

      this.setState({
        text: this.binding.snapshot
      }, onLoaded);
    });

    doc.on('del', () => {
      doc.removeListener();
      doc.destroy();
      doc.unsubscribe();
    });

    doc.on('op', op => {
      setTimeout(() => {
        this.updateField(op);
      }, 0);
    });
  }

  updateField(op) {
    this.setState({
      text: this.binding.applyOp(op)
    });
  }

  render() {
    const {
      cols,
      cssClass,
      elementType,
      rows,
      style
    } = this.props;

    const { text } = this.state;

    const element = elementType === 'div'
      ? <div
        className={cssClass || ''}
        style={style || ''}>
        {text}
      </div>
      : <textarea
        className={cssClass || ''}
        style={style || ''}
        cols={cols || 100}
        rows={rows || 10} />;
    return (
      element
    );
  }
}
