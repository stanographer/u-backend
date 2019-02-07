import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './index.css';

function DocApi(props) {
  const [rawText, setRawText] = useState('');

  useEffect(() => {
    const query = queryString.parse(props.location.search);


    fetch(`/api/?user=${ query.user }&job=${ query.job }`)
      .then(res => res.text())
      .then(text => setRawText(text))
      .catch(err => setRawText('Could not retrieve this document. Check the URL and that it exists. Error: ' + err));
  }, {});

  return (
    <div className="rawTextDoc">
      { rawText }
    </div>
  );
}

export default DocApi;
