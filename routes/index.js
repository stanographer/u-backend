const cors = require('cors');
const cowsay = require('cowsay');
const express = require('express');
const router = express.Router();

router.use(cors());

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

router.get('/moo', cors(corsOptions), async(req, res, next) => {
  try {
    const moo = cowsay.say({
      text: 'Welcome to Upword.ly!',
      cow: '', // Template for a cow, get inspiration from `./cows`
      eyes: 'oo', // Select the appearance of the cow's eyes, equivalent to cowsay -e
      tongue: 'L|', // The tongue is configurable similarly to the eyes through -T and tongue_string, equivalent to cowsay -T
      wrap: false, // If it is specified, the given message will not be word-wrapped. equivalent to cowsay -n
      wrapLength: 40, // Specifies roughly where the message should be wrapped. equivalent to cowsay -W
      mode: 'b', // One of 	"b", "d", "g", "p", "s", "t", "w", "y"
    });
    res.json({ moo });
  } catch (err) {
    next(err);
  }
});

// Global path.
router.get('*', cors(corsOptions), (req, res) => {
  response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

module.exports = router;
