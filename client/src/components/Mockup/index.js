import React, { useState, useEffect } from 'react';
import { wordIterator } from './fakeCaptions';

function Mockup() {
  let captions = {
    text: '',
    addText: function(newText) {
      this.text += newText + ' ';
    }
  };
  const [text, setText] = useState(captions.text);

  useEffect(() => {
    let print = setInterval(() => {
      const data = wordIterator.next();

      if (data.done !== true) {
        captions.addText(data.word);
        setText(text + captions.text);
      } else {
        clearInterval(print);
      }

    }, 300);

    return () => clearInterval(print);
  });

  return (
    <div>
      <p>{ text }</p>
    </div>
  );
}

export default Mockup;
