import React, { useState, useEffect } from 'react';
import Binding from './react-binding';

function ShareDBBinding(props) {
  const { doc, onLoaded, cssClass, style } = props;
  let [text, setText] = useState('');
  let binding;

  useEffect(() => {
    doc.subscribe(err => {
      if (err) {
        console.log(err);
      }
      if (doc.type === null) {
        console.error('This document could not be subscribed to.');
      }
    });

    // Load document and bind it to local snapshot.
    doc.on('load', () => {
      binding = new Binding(doc.data, props.flag);
      setText(binding.snapshot);
      onLoaded();
    });

    // Apply remote ops to local snapshot.
    doc.on('op', op => {
       // window.requestAnimationFrame(() => setText(binding.applyOp(op)));
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

export default ShareDBBinding;
