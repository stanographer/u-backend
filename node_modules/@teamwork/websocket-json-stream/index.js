const Duplex = require('stream').Duplex
const WebSocket = require('ws')
const destroy = require('./destroy').destroy
const noop = function () {}

const NORMAL_CLOSURE_CODE = 1000
const NORMAL_CLOSURE_REASON = 'stream end'
const INTERNAL_ERROR_CODE = 1011
const INTERNAL_ERROR_REASON = 'stream error'

module.exports = class WebSocketJSONStream extends Duplex {
    constructor(ws) {
        super({
            objectMode: true,
            allowHalfOpen: false,
            emitClose: false
        })

        this.ws = ws;

        this.ws.on('message', message => {
            let value

            try {
                value = JSON.parse(message)
            } catch (error) {
                return this.emit('error', error)
            }

            if (value == null) {
                return this.emit('error', new Error('Can\'t JSON.parse the value'))
            }

            this.push(value)
        })

        this.ws.on('close', () => {
            this.push(null)
            this.emit('close')
        })

        this.ws.on('error', error => {
            this.emit('error', error)
        })

        // Required by nodejs 6.X.X which does not support `_final`.
        this.once('finish', () => this._closeOnStreamEnd(noop))

        // Required by nodejs 6.X.X which does not support `destroy`.
        /* istanbul ignore if */
        if (typeof this.destroy !== 'function') {
            this.destroy = destroy
        }
    }

    _read() {}

    _write(object, encoding, callback) {
        let json

        try {
            json = JSON.stringify(object)
        } catch (error) {
            return callback(error)
        }

        if (typeof json !== 'string') {
            return callback(new Error('Can\'t JSON.stringify the value'))
        }

        this.ws.send(json, callback)
    }

    _final(callback) {
        this._closeOnStreamEnd(callback)
    }

    _destroy(error, callback) {

        /*
         * Calling destroy without an error object will close the stream
         * without a code. This results in the client emitting a CloseEvent
         * that has code 1005.
         *
         * 1005 is a reserved value and MUST NOT be set as a status code in a
         * Close control frame by an endpoint.  It is designated for use in
         * applications expecting a status code to indicate that no status
         * code was actually present.
         * https://tools.ietf.org/html/rfc6455#section-7.4.1
         */
        let code
        let reason

        if (error) {

            /*
             * 1011 indicates that a remote endpoint is terminating the
             * connection because it encountered an unexpected condition that
             * prevented it from fulfilling the request.
             * http://www.rfc-editor.org/errata_search.php?eid=3227
             */
            code = error.closeCode || INTERNAL_ERROR_CODE
            reason = error.closeReason || INTERNAL_ERROR_REASON
        }
        this._closeWebSocket(code, reason, () => callback(error))
    }

    _closeOnStreamEnd(callback) {

        /*
         * 1000 indicates a normal closure, meaning that the purpose for which
         * the connection was established has been fulfilled.
         * https://tools.ietf.org/html/rfc6455#section-7.4.1
         */
        this._closeWebSocket(NORMAL_CLOSURE_CODE, NORMAL_CLOSURE_REASON, callback)
    }

    _closeWebSocket(code, reason, callback) {
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                this.ws.once('error', () => this._closeWebSocket(code, reason, callback))
                this.ws.once('open', () => this._closeWebSocket(code, reason, callback))
                break
            case WebSocket.OPEN:
                this.ws.once('close', () => callback())
                this.ws.close(code, reason)
                break
            case WebSocket.CLOSING:
                this.ws.once('close', () => callback())
                break
            case WebSocket.CLOSED:
                process.nextTick(callback)
                break
            /* istanbul ignore next */
            default:
                process.nextTick(() => callback(new Error(`Unexpected readyState: ${this.ws.readyState}`)))
                break
        }
    }
}
