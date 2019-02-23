/*
 Class takes in a snapshot as a string and transforms the text
 before sending changes back up.
 */

class Binding {
  constructor(snapshot, flag) {
    this.snapshot = snapshot;
    this.flag = flag;
  }

  // Methods to update state text whenever ops are received
  // through WebSockets.

  applyOp(op) {

    // When an op is received, transform it, and
    // set it equal to the component snapshot.
    this.snapshot = Binding.transformSnapshot(op, this.snapshot);
    return this.snapshot;
  }

  static transformSnapshot(op, snap) {

    // Create a new temp variable to hold changes.
    const newDoc = [];

    // Loop through the ops object.
    for (let i = 0; i < op.length; i++) {
      let component = op[i];
      // Classifies the different components of the op.
      switch (typeof component) {
        // If it is a number, make it the index.
        case 'number':
          newDoc.push(snap.slice(0, component));
          snap = snap.slice(component);
          break;
        // If it is a string, we know to insert it into the temp variable.
        case 'string':
          newDoc.push(component);
          break;
        // If it is an object, we know it's a delete command.
        case 'object':
          snap = snap.slice(component.d);
          break;
      }
    }
    // Once that is done, join the changes stored in the temp variable
    // to the snapshot and send it back to applyOp().
    return newDoc.join('') + snap;
  }
}

export default Binding;
