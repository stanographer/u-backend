// Copied from:
// https://github.com/nodejs/node/blob/f5a2167eb5565b84e068b385dc22c5e74f543d1b/lib/internal/streams/destroy.js

'use strict';

// undocumented cb() API, needed for core, not for public API
function destroy(err, cb) {
  const readableDestroyed = this._readableState &&
    this._readableState.destroyed;
  const writableDestroyed = this._writableState &&
    this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err &&
               (!this._writableState || !this._writableState.errorEmitted)) {
      process.nextTick(emitErrorNT, this, err);
    }
    return this;
  }

  // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks

  if (this._readableState) {
    this._readableState.destroyed = true;
  }

  // if this is a duplex stream mark the writable part as destroyed as well
  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, (err) => {
    if (!cb && err) {
      process.nextTick(emitErrorAndCloseNT, this, err);
      if (this._writableState) {
        this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose)
    return;
  if (self._readableState && !self._readableState.emitClose)
    return;
  self.emit('close');
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

module.exports = {
  destroy
};
