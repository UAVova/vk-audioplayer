const electron = require('electron')
const vk_api = require('vksdk')
const {app, BrowserWindow, ipcMain} = electron
const vkAuthClass = require('./custom_modules/vk_auth.js')
// To make 'vksdk' package work, we'll need to provide those params.
// As long as 'vksdk' not providing any way for User authentication
// we'll get token using BrowserWindow and than apply it directrly
// to the 'vksdk'. So, for now we can just put here any random values.
let vk  = new vk_api({
    'appId'     : 0,
    'appSecret' : 0
})

let vkAuth = null
app.on('ready', () => {
  // Creating new 'instance' of vk_api in the ready event because
  // of BrowserWindow component that are used in that class.
  // Also, need to add event here too, because outside of this
  // block 'vk' variable is null when application starts,
  // so you can't attach event to null.
  // @todo Find a way to move this into Renderer process
  // https://discuss.atom.io/t/using-browserwindow-in-the-module/30949
  vkAuth = new vkAuthClass({ client_id: 5525255, scopes: ['audio', 'email', 'offline'] })
  vkAuth.on('token-received', tokenReady)

  let win = new BrowserWindow({height: 300, width: 300})
  //win.setMenu(null);
  win.loadURL(`file://${__dirname}/views/login.html`)
})

let tokenReady = (token) => {
  vk.setToken(token)
  console.log(token)
  // This is needed for token to be passed automatically to
  // request params
  vk.setSecureRequests(true)
  let win = new BrowserWindow({height: 600, width: 696})
  win.loadURL(`file://${__dirname}/views/player.html`)
  vk.request('audio.get', {'need_user': 1, 'count': 10}, (_p) => {
    console.log(_p.response.items.length);
    win.webContents.send('tracks-received', _p)
  })
}

ipcMain.on('open-auth-window', (token) => {
  vkAuth.authenticate()
})

ipcMain.on('token-received', (token) => {
  // Windows 10 acts differently when it comes to window size,
  // so we need to provide window width we need + 16, to get
  // needed windows width.
  // https://github.com/electron/electron/issues/4045
  let win = new BrowserWindow({height: 600, width: 696})
  win.loadURL(`file://${__dirname}/views/player.html`)
})
