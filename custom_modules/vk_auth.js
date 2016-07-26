const util = require('util')
const {BrowserWindow} = require('electron')
const EventEmitter = require('events').EventEmitter



class Auth extends EventEmitter {

  constructor(options) {
    super()
    this.options = options
    this.createWindow()
    this.authUrl = 'https://oauth.vk.com/authorize?client_id=' + this.options.client_id + '&scope=' + this.options.scopes + '&response_type=token'
  }

  authenticate() {
    this.win.loadURL(this.authUrl)
    this.win.show()
  }

  handleCallback(url) {
    let raw_code = /token=([^&]*)/.exec(url) || null
    let code = (raw_code && raw_code.length > 1) ? raw_code[1] : null
    let error = /\?error=(.+)$/.exec(url)

    if (code || error) {
      // Close the browser if code found or error
      this.win.destroy()
      this.emit('token-received', code)
    }
  }

  createWindow() {
    this.win = new BrowserWindow({width: 800, height: 600, show: false, 'node-integration': false})
    this.win.webContents.on('did-get-redirect-request', (event, oldUrl, newUrl) => {
      this.handleCallback(newUrl)
    })
    this.win.on('close', () => {
        this.win = null
    }, false)

  }
}

module.exports = Auth
