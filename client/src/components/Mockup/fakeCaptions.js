const sample = 'DAVID MALAN: Okay. So today we peel back the layers that we\'ve been assuming for some time now. We\'ve been talking about integers and characters. But we also had this higher level concept of a string, which was a generic way of saying you had back-to-back characters that represent words or sentences or paragraphs or whatnot.\n' +
  '\tBut today we reveal that that\'s actually been a bit of a lie.\n' +
  'There actually is no such thing as string in the language called C. And indeed, you might have kind of suspected as much, given that we keep including cs50.h, which gives you things like GetInt and GetString and so forth. But it also gives you string, literally, a keyword that actually doesn\'t come with C. And before we peel back what exactly it is, let\'s consider perhaps what problems it creates and what powers it reveals to understand what\'s going on underneath the hood. And let me propose that we try to implement, at least in pseudocode, this algorithm here, swap.\n' +
  '\tSo I proclaim that swap is a function whose purpose in life is to take two inputs — let\'s call it a and b — and just swap them, so that a becomes b, and b becomes a. And before we even get into the weeds of pseudocode or actual code, we actually have two values here.\n' +
  '\tMight anyone like to join me onstage for just a moment for a drink of Gatorade?\n' +
  '\tA little Gatorade?\n' +
  '\tMaybe someone a little farther back today?\n' +
  '\tA little drink?\n' +
  '\tYeah?\n' +
  '\tOkay. Come on down.\n' +
  '\tWhat\'s your name?\n' +
  '\n' +
  'KATE: Kate.\n' +
  '\n' +
  'DAVID MALAN: Kate, come on down. Join me for some Gatorade onstage. Welcome to Kate. All right.\n' +
  '\tSo the challenge at hand is this. Let me just set us up here. So we have some green. That\'s very unnatural looking. Okay. We have some pink. And you know what? I think, actually, I\'d like the pink, and maybe you could have green. I need you to swap the values of these two cups if you could. I need you to get the pink into the green cup and the green into the pink cup.\n' +
  '\n' +
  'KATE: I think I need another cup.\n' +
  '\n' +
  'DAVID MALAN: Okay. So she thinks she\'s going to need another cup. And okay, so good. I came prepared. So we need another variable, if you will. Okay. So here we go, Kate. Set us up.';

function iter(arr) {
  let i = 0;
  return {
    next() {
      if (i < arr.length) {
        return {
          word: arr[i++],
          done: false
        };
      } else {
        return {
          done: true
        };
      }
    }
  };
}

const textBlock = sample
  .trim()
  .split(' ');

const wordIterator = iter(textBlock);

module.exports = {
  wordIterator
};
