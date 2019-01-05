const cors = require('cors');
const express = require('express');
const otText = require('ot-text');
const redisPubSub = require('sharedb-redis-pubsub')(
  process.env.NODE_ENV === 'dev'
    ? 'redis://localhost:6379'
    : 'redis://redis:6379');
const router = express.Router();
const ShareDB = require('sharedb');
const ShareDBMongo = require('sharedb-mongo')(
  process.env.NODE_ENV === 'dev'
    ? 'mongodb://localhost:27017/aloft'
    : 'mongodb://mongo:27017/upwordly');

const shareDbOptions = {
  db: ShareDBMongo,
  pubsub: redisPubSub,
  disableSpaceDelimitedActions: true,
  disableDocAction: true
};

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const backend = new ShareDB(shareDbOptions);
ShareDB.types.register(otText.type);
const connection = backend.connect();

const send200 = (res, message) => {
  if (message == null) message = `Sorry. There's either nothing here yet or this document doesn't exist.\n`;

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });

  res.end(message);
};

// Raw text API allows retrieval of raw transcript text.
router.get('/', cors(corsOptions), (req, res) => {
  const doc = connection.get(req.query.user, req.query.job);

  doc.fetch(err => {
    if (err) res.status(500).send('Sorry, there was an error retrieving that document.');
    send200(res, doc.data);
  });
});

router.get('/snippet', cors(corsOptions), (req, res) => {
  const doc = connection.get(req.query.user, req.query.job);

  doc.fetch(err => {
    if (err) return res.send('');

    try {
      const snippet = doc.data.substring(0, 200);
      send200(res, snippet);
    } catch (err) {
      res.send('There was an error: ' + err);
    }
  });
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Upword.ly' });
});

/* Deletes a job from the ShareDB repo. */
router.delete('/', cors(corsOptions), (req, res) => {
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
