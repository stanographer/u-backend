const assert = require('chai').assert
const http = require('http')
const WebSocket = require('ws')
const WebSocketJSONStream = require('..')
const testCloseStatus = require('./close-status')

const handler = (done, code) => (...args) => {
    try {
        code(...args)
        done()
    } catch (e) {
        done(e)
    }
}

describe('WebSocketJSONStream', function () {
    beforeEach(function (done) {
        this.httpServer = http.createServer()
        this.wsServer = new WebSocket.Server({ server: this.httpServer })
        this.httpServer.listen(() => {
            const address = this.httpServer.address()

            this.url = `http://${address.address}:${address.port}`
            this.connect(({ clientWebSocket, serverWebSocket }) => {
                this.clientStream = new WebSocketJSONStream(this.clientWebSocket = clientWebSocket)
                this.serverStream = new WebSocketJSONStream(this.serverWebSocket = serverWebSocket)
                done()
            })
        })

        this.connect = function (callback) {
            const clientWebSocket = new WebSocket(this.url)

            this.wsServer.once('connection', serverWebSocket => {
                clientWebSocket.once('open', () =>
                    callback({ clientWebSocket, serverWebSocket }))
            })
        }
    })

    afterEach(function (done) {
        this.wsServer.close()
        this.httpServer.close(done)
    })

    it('should send and receive messages', function (done) {
        const serverSentData = [ { a: 1 }, { b: 2 } ]
        const clientSentData = [ { y: -1 }, { z: -2 } ]
        const serverReceivedData = []
        const clientReceivedData = []

        this.serverStream.on('data', data => serverReceivedData.push(data))
        this.clientStream.on('data', data => clientReceivedData.push(data))
        this.clientStream.on('close', handler(done, () => {
            assert.deepEqual(serverReceivedData, clientSentData)
            assert.deepEqual(clientReceivedData, serverSentData)
        }))

        serverSentData.forEach(data => this.serverStream.write(data))
        clientSentData.forEach(data => this.clientStream.write(data))
        this.clientStream.end()
    })

    it('should get clientStream close on clientStream.end()', function (done) {
        this.clientStream.on('close', () => done())
        this.clientStream.end()
    })
    it('should get clientStream close on serverStream.end()', function (done) {
        this.clientStream.on('close', () => done())
        this.serverStream.end()
    })
    it('should get serverStream close on clientStream.end()', function (done) {
        this.serverStream.on('close', () => done())
        this.clientStream.end()
    })
    it('should get serverStream close on serverStream.end()', function (done) {
        this.serverStream.on('close', () => done())
        this.serverStream.end()
    })

    it('should get clientStream close on clientStream.destroy()', function (done) {
        this.clientStream.on('close', () => done())
        this.clientStream.destroy()
    })
    it('should get clientStream close on serverStream.destroy()', function (done) {
        this.clientStream.on('close', () => done())
        this.serverStream.destroy()
    })
    it('should get serverStream close on clientStream.destroy()', function (done) {
        this.serverStream.on('close', () => done())
        this.clientStream.destroy()
    })
    it('should get serverStream close on serverStream.destroy()', function (done) {
        this.serverStream.on('close', () => done())
        this.serverStream.destroy()
    })

    it('should get clientStream finish on clientStream.end()', function (done) {
        this.clientStream.on('finish', () => done())
        this.clientStream.end()
    })
    it('should get serverStream finish on serverStream.end()', function (done) {
        this.serverStream.on('finish', () => done())
        this.serverStream.end()
    })
    it('should get serverStream end on clientStream.end()', function (done) {
        this.serverStream.on('end', () => done())
        this.clientStream.end()
        this.serverStream.resume()
    })
    it('should get clientStream end on serverStream.end()', function (done) {
        this.clientStream.on('end', () => done())
        this.serverStream.end()
        this.clientStream.resume()
    })
    it('should get serverStream end on serverStream.end()', function (done) {
        this.serverStream.on('end', () => done())
        this.serverStream.resume()
        this.serverStream.end()
    })
    it('should get clientStream end on clientStream.end()', function (done) {
        this.clientStream.on('end', () => done())
        this.clientStream.resume()
        this.clientStream.end()
    })

    it('should get clientStream error on clientWebSocket error', function (done) {
        const error = new Error('test')
        this.clientStream.once('error', handler(done, e => assert.strictEqual(e, error)))
        this.clientWebSocket.emit('error', error)
    })
    it('should get serverStream error on serverWebSocket error', function (done) {
        const error = new Error('test')
        this.clientStream.once('error', handler(done, e => assert.strictEqual(e, error)))
        this.clientWebSocket.emit('error', error)
    })
    it('should get clientStream error on clientStream.write invalid data (Symbol)', function (done) {
        this.clientStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.clientStream.write(Symbol('Test'))
    })
    it('should get serverStream error on serverStream.write invalid data (Symbol)', function (done) {
        this.serverStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.serverStream.write(Symbol('Test'))
    })
    it('should get clientStream error on clientStream.write invalid data (cyclic data)', function (done) {
        const data = {}
        data.a = data
        this.clientStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.clientStream.write(data)
    })
    it('should get serverStream error on serverStream.write invalid data (cyclic data)', function (done) {
        const data = {}
        data.a = data
        this.serverStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.serverStream.write(data)
    })
    it('should get clientStream error on serverWebSocket.send invalid data', function (done) {
        this.clientStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.serverWebSocket.send('qwerty')
    })
    it('should get serverStream error on clientWebSocket.send invalid data', function (done) {
        this.serverStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.clientWebSocket.send('qwerty')
    })
    it('should get clientStream error on clientStream.write after end', function (done) {
        this.clientStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.clientStream.end()
        this.clientStream.write({})
    })
    it('should get serverStream error on serverStream.write after end', function (done) {
        this.serverStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
        this.serverStream.end()
        this.serverStream.write({})
    })
    it('should get clientStream error on clientStream.write, if clientWebSocket is closed', function (done) {
        this.clientWebSocket.on('close', () => {
            this.clientStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
            this.clientStream.write({})
        })
        this.clientWebSocket.close()
    })
    it('should get serverStream error on serverStream.write, if serverWebSocket is closed', function (done) {
        this.serverWebSocket.on('close', () => {
            this.serverStream.once('error', handler(done, e => assert.instanceOf(e, Error)))
            this.serverStream.write({})
        })
        this.serverWebSocket.close()
    })
    it('should get clientStream error when clientWebSocket is not open yet', function (done) {
        const clientWebSocket = new WebSocket(this.url)
        const clientStream = new WebSocketJSONStream(clientWebSocket)
        let e = null

        // Delay `done` to avoid afterEach failure.
        clientWebSocket.on('open', handler(done, () => assert.instanceOf(e, Error)))
        clientStream.on('error', error => e = error)
        clientStream.write({})
    })
    it('should get clientStream error when clientWebSocket sends JSON-encoded null', function (done) {
        this.clientStream.on('error', handler(done, e => assert.instanceOf(e, Error)))
        this.serverWebSocket.send('null')
    })
    it('should get clientStream error when clientWebSocket sends JSON-encoded undefined', function (done) {
        this.clientStream.on('error', handler(done, e => assert.instanceOf(e, Error)))
        this.serverWebSocket.send('undefined')
    })

    it('should not crash on clientStream.destroy when clientWebSocket.readyState === WebSocket.CONNECTING', function (done) {
        const clientWebSocket = new WebSocket(this.url)
        const clientStream = new WebSocketJSONStream(clientWebSocket)

        clientStream.on('close', () => done())
        clientStream.destroy()
    })
    it('should not crash on clientStream.destroy when clientWebSocket.readyState === WebSocket.CONNECTING and gets error', function (done) {
        const clientWebSocket = new WebSocket('http://invalid-url:0')
        const clientStream = new WebSocketJSONStream(clientWebSocket)

        clientStream.on('error', () => null) // ignore invalid-url error
        clientStream.on('close', () => done())
        clientStream.destroy()
    })
    it('should not crash on clientStream.destroy when clientWebSocket.readyState === WebSocket.CLOSED', function (done) {
        const clientWebSocket = new WebSocket(this.url)

        clientWebSocket.on('close', () => {
            new WebSocketJSONStream(clientWebSocket).destroy()
            done()
        })
        clientWebSocket.on('open', () => clientWebSocket.close())
    })

    testCloseStatus()
})
