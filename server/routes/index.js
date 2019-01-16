const cowsay = require('cowsay');
const express = require('express');
const router = express.Router();

router.get('/moo', async(req, res, next) => {
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

module.exports = router;
