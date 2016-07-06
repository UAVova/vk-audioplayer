const electron = require('electron')
const {app, BrowserWindow} = electron


app.on('ready', () => {
  let win = new BrowserWindow({height: 600, width: 800})
  win.loadURL(`file://${__dirname}/views/player.html`)
})
