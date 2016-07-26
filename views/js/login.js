const main = require('electron').remote.require('./main.js')
const {ipcRenderer} = require('electron')

// Button to login through VK.com
const vkButton = document.getElementById('vk-button')

vkButton.onclick = () => {
  ipcRenderer.send('open-auth-window')
}
