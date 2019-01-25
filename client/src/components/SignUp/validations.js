// Make sure email is a valid one.

const validateEmail = email => {
  const re = /^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i;
  return re.test(email);
};

// Analyzing passwords and spits out helper messages to the user to make sure they meet requirements.

const validatePassword = password => {
  let passwordStrength = {
    strength: 'weak',
    message: 'Must be longer than 0 characters.'
  };

  const rules = {
    all: new RegExp('^(?=.*[A-Za-z.\s_-])(?=.*[0-9])(?=.*[!@#$%^&*()><,.\'\":;=+])(?=.{6,})'),
    atLeastSix: new RegExp('^(?=.{6,})'),
    containsAlpha: new RegExp('^(?=.*[A-Za-z.\s_-])'),
    containsNum: new RegExp('^(?=.*[0-9])'),
    containsSymbol: new RegExp('^(?=.*[!@#$%^&*()?><,.\'\":;=+])'),
    isntCommon: new RegExp('^(?!.*pass|.*word|.*1234|.*123|.*qwer|.*asdf|.*home|.*hello|.*welcome.*|abc.*|abcd)')
  };

  switch (password && password.length > 0) {
    case !rules.atLeastSix.test(password):
      passwordStrength.message = 'Password must at least 6 characters.';
      passwordStrength.strength = 'medium';
      break;
    case !rules.containsAlpha.test(password):
      passwordStrength.strength = 'weak';
      passwordStrength.message = 'Password must contain letters.';
      break;
    case !rules.containsSymbol.test(password):
      passwordStrength.strength = 'medium';
      passwordStrength.message = 'Password must contain at least one symbol (!, @, #, $, etc.).';
      break;
    case !rules.isntCommon.test(password):
      passwordStrength.strength = 'weak';
      passwordStrength.message = 'Password must not contain common sequences ("pass", "qwerty", "1234", etc.).';
      break;
    case !rules.containsNum.test(password):
      passwordStrength.message = 'Password must contain at least 1 numeral.';
      passwordStrength.strength = 'medium';
      break;
    case rules.all.test(password):
      passwordStrength.strength = 'strong';
      passwordStrength.message = 'Password is nice and strong.';
      break;
    default:
      break;
  }
  return passwordStrength;
};

export {
  validateEmail,
  validatePassword
};
