import React, { useState, useEffect } from 'react';
import Binding from './react-binding';
import PropTypes from 'prop-types';

function ShareDBBinding(props) {
  const { doc, onLoaded, cssClass, flag, style } = props;

  let [text, setText] = useState('');
  let binding;

  useEffect(() => {
    doc.subscribe(err => {
      if (err) {
        setText('There was a connection error: ' + err);
      }
      if (doc.type === null) {
        setText('This document could not be subscribed to.');
      }
    });

    // Load document and bind it to local snapshot.
    doc.on('load', () => {
      binding = new Binding(doc.data, flag);
      setText(binding.snapshot);
      onLoaded();
    });

    // Apply remote ops to local snapshot.
    doc.on('op', op => {
      setTimeout(() => {
        setText(binding.applyOp(op));
      }, 0);
    });

    // Destroy listeners.
    return () => {
      doc.unsubscribe();
      doc.destroy();
      binding = null;
    };
  }, []);

  return (
    <div
      className={ cssClass || '' }
      style={ style || '' }>
      { text }
    </div>
  );
}

ShareDBBinding.propTypes = {
  doc: PropTypes.object,
  onLoaded: PropTypes.func,
  cssClass: PropTypes.string,
  style: PropTypes.object,
  flag: PropTypes.string
};

export default ShareDBBinding;
