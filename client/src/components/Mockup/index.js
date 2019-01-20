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
    const print = setInterval(() => {
      const data = wordIterator.next();

      if (data.done === true) clearInterval(print);
      captions.addText(data.word);
      setText(text + captions.text);
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
