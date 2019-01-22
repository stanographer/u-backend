const cors = require('cors');
const express = require('express');
const router = express.Router();

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const send200 = (res, message) => {
  if (message == null) {
    message = 'Sorry. There\'s either nothing here yet or this document doesn\'t exist.\n';
  }

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });
  res.end(message);
};

/* Raw text API allows retrieval of raw transcript text. */
router.get('/', cors(corsOptions), (req, res, next) => {
  const connection = req.app.sharedb.connect();

  if (!req.query.user && !req.query.job) {
    return res.send('Upwordly API version 0.1.0');
  }

  const doc = connection.get(req.query.user, req.query.job);

  doc.fetch(err => {
    if (err) {
      return res.send(500, 'Sorry, that doc could not be fetched.');
    }
    send200(res, doc.data);
    next();
  });
});

/* Retrieves snippets */
router.get('/snippet', cors(corsOptions), (req, res, next) => {
  const connection = req.app.sharedb.connect();

  if (!req.query.user && !req.query.job) {
    return res.send('Upwordly API version 0.1.0 (snippets)');
  }

  const doc = connection.get(req.query.user, req.query.job);

  doc.fetch(err => {
    if (err) {
      return res.end('Sorry, that doc could not be fetched.');
    }
    const snippet = doc.data ? doc.data.substring(0, 200) : '';
    send200(res, snippet);
    next();
  });
});

/* Deletes a job from the ShareDB repo. */
router.delete('/', cors(corsOptions), (req, res) => {
  const connection = req.app.sharedb.connect();
  const doc = connection.get(req.query.user, req.query.job);
  try {
    doc.fetch(err => {
      if (err) res.status(500).send('Sorry, there was an error in retrieving that document for deletion.');
      doc.del(err => {
        if (err) res.status(500).send('Sorry, there was an error in deleting that document.');
        doc.destroy();
        res.json('Job successfully deleted!');
      });
    });
  } catch (err) {
    res.status(500).send('Sorry. That document exist or is empty!');
  }
});

module.exports = router;
