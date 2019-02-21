/* This contains the textarea binding for ShareDB. This binding is really
 * simple, and a bit slow on big texuments (Its O(N). However, it requires no
 * changes to the DOM and no heavy libraries like ace. It works for any kind of
 * text input field.
 *
 * You probably want to use this binding for small fields on forms and such.
 * For code editors or rich text editors or whatever, I recommend something
 * heavier.
 */

/* applyChange creates the edits to convert oldVal -> newVal.
 *
 * This function should be called every time the text element is changed.
 * Because changes are always localised, the diffing is quite easy. We simply
 * scan in from the start and scan in from the end to isolate the edited range,
 * then delete everything that was removed & add everything that was added.
 * This wouldn't work for complex changes, but this function should be called
 * on keystroke - so the edits will mostly just be single character changes.
 * Sometimes they'll paste text over other text, but even then the diff
 * generated by this algorithm is correct.
 *
 * This algorithm is O(N). I suspect you could speed it up somehow using regular expressions.
 */
let applyChange = function(doc, oldVal, newVal) {

  // Strings are immutable and have reference equality. I think this tests is O(1), so its worth doing.
  if (oldVal === newVal) {
    return;
  }

  let commonStart = 0;
  while (oldVal.charAt(commonStart) === newVal.charAt(commonStart)) {
    commonStart++;
  }

  let commonEnd = 0;
  while (oldVal.charAt(oldVal.length - 1 - commonEnd) === newVal.charAt(newVal.length - 1 - commonEnd) &&
  commonEnd + commonStart < oldVal.length && commonEnd + commonStart < newVal.length) {
    commonEnd++;
  }

  if (oldVal.length !== commonStart + commonEnd) {
    // doc.api.remove(commonStart, oldVal.length - commonStart - commonEnd);
    let op = [commonStart, '', {
      d: oldVal.length - commonStart - commonEnd
    }];
    doc.submitOp(op);
  }

  if (newVal.length !== commonStart + commonEnd) {
    // doc.insert(commonStart, newVal.slice(commonStart, newVal.length - commonEnd));
    doc.submitOp([commonStart, newVal.slice(commonStart, newVal.length - commonEnd)]);
  }
};

// Attach a textarea to a document's editing context.
//
// The context is optional, and will be created from the document if its not
// specified.
export const attachTextarea = function(elem, doc) {
  // if (!doc) doc = this.createContext();
  // if (!doc.provides.text) throw new Error('Cannot attach to non-text document');

  elem.value = doc.data;

  // The current value of the element's text is stored so we can quickly check
  // if its been changed in the event handlers. This is mostly for browsers on
  // windows, where the content contains \r\n newlines. applyChange() is only
  // called after the \r\n newlines are converted, and that check is quite
  // slow. So we also cache the string before conversion so we can do a quick
  // check in case the conversion isn't needed.

  let prevValue;
  let newSelection = [];

  /*
   ADD-IN
   Enabling the tab key on the textarea.
   */

  elem.onkeydown = e => {
    // Tab was pressed
    if (e.key === 'Tab') {

      // Prevent normal behavior of switching element focus.
      e.preventDefault();

      // Get caret position/selection
      let val = elem.value,
        start = elem.selectionStart,
        end = elem.selectionEnd;

      // Set textarea value to: text before caret + tab + text after caret
      elem.value = val.substring(0, start) + '\t' + val.substring(end);

      // Put caret at right position again
      elem.selectionStart = elem.selectionEnd = start + 1;

      // Prevent the focus lose
      return false;
    }
  };

  /* Replace the content of the text area with newText, and transform the
   current cursor by the specified function. */

  let replaceText = function(newText, transformCursor) {
    if (transformCursor) {
      newSelection = [transformCursor(elem.selectionStart), transformCursor(elem.selectionEnd)];
    }

    // Fixate the window's scroll while we set the element's value. Otherwise
    // the browser scrolls to the element.
    let scrollTop = elem.scrollTop;
    elem.value = newText;
    prevValue = elem.value; // Not done on one line so the browser can do newline conversion.
    if (elem.scrollTop !== scrollTop) {
      elem.scrollTop = scrollTop;
    }

    // Setting the selection moves the cursor. We'll just have to let your
    // cursor drift if the element isn't active, though usually users don't
    // care.
    if (newSelection && window.document.activeElement === elem) {
      elem.selectionStart = newSelection[0];
      elem.selectionEnd = newSelection[1];
    }
  };

  replaceText(doc.data);

  // *** remote -> local changes

  doc.on('op', function(op, localContext) {
    if (localContext === true) {
      return;
    }

    let prev = elem.value;
    const newDoc = [];

    // Loop through the ops object.
    for (let i = 0; i < op.length; i++) {
      let component = op[i];
      // Classifies the different components of the op.
      switch (typeof component) {
        // If it is a number, make it the index.
        case 'number':
          // fields.pos = component;
          newDoc.push(prev.slice(0, component));
          prev = prev.slice(component);
          break;
        // If it is a string, we know to insert it into the temp variable.
        case 'string':
          // fields.insertStr = component;
          // onInsert(fields.pos, fields.insertStr);
          newDoc.push(component);
          break;
        // If it is an object, we know it's a delete command.
        case 'object':
          prev = prev.slice(component.d);
          // fields.delNum = component.d;
          // onRemove(fields.pos, fields.delNum);
          break;
      }
    }
    return setTimeout(() => {
      replaceText(newDoc.join('') + prev);
    }, 0);
  });

  // *** local -> remote changes

  // This function generates operations from the changed content in the textarea.
  let genOp = function(event) {
    // In a timeout so the browser has time to propagate the event's changes to the DOM.
    setTimeout(function() {
      if (elem.value !== prevValue) {
        prevValue = elem.value;
        applyChange(doc, doc.data, elem.value);
      }
    }, 0);
  };

  let eventNames = ['textInput', 'keydown', 'keyup', 'select', 'cut', 'paste'];
  for (let i = 0; i < eventNames.length; i++) {
    let e = eventNames[i];
    if (elem.addEventListener) {
      elem.addEventListener(e, genOp, false);
    } else {
      elem.attachEvent('on' + e, genOp);
    }
  }

  doc.detach = function() {
    for (let i = 0; i < eventNames.length; i++) {
      let e = eventNames[i];
      if (elem.removeEventListener) {
        elem.removeEventListener(e, genOp, false);
      } else {
        elem.detachEvent('on' + e, genOp);
      }
    }
  };

  return doc;
};
