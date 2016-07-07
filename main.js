const electron = require('electron')
const {app, BrowserWindow} = electron


app.on('ready', () => {
  let win = new BrowserWindow({height: 600, width: 696})
  win.loadURL(`file://${__dirname}/views/player.html`)
  console.log(process.versions.electron);
})
