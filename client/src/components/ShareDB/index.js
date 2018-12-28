import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Binding from './react-binding';

function ShareDBBinding(props) {
  const { doc, onLoaded, cssClass, style } = props;
  let [text, setText] = useState('');
  let binding;

  useEffect(() => {
    doc.subscribe(err => {
      if (err) console.log(err);
      if (doc.type === null) console.error('This document could not be subscribed to.');
    });

    doc.on('load', () => {
      binding = new Binding(doc.data, props.flag);
      setText(binding.snapshot);
      onLoaded();
    });

    doc.on('op', op => {
      setTimeout(() => {
         setText(binding.applyOp(op));
      }, 0);
    });

    return () => {
      doc.unsubscribe();
      doc.destroy();
      binding = null;
    }
  }, []);

  return(
    <div
      className={cssClass || ''}
      style={style || ''}>
      {text}
    </div>
  );
}

export default ShareDBBinding;
