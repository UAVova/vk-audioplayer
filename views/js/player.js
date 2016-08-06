const {ipcRenderer} = require('electron')
let plr = require('../custom_modules/player.js')

let Player = new plr()

// JQuery style :)
// It'll be tested later
// let $ = function (selector) {
//   return document.querySelector(selector);
// }
let forEach = (array, callback, scope) => {
  for (var i = 0; i < array.length; i++) {
    callback.call(scope, i, array[i]);
  }
}

ipcRenderer.on('tracks-received', (event, playlist) => {
  if (playlist.response.items.length > 0) {
    Player.owner = playlist.response.items.splice(0, 1);
    Player.playlist = playlist.response.items
  }

  let playlistHtml = ''
  Player.playlist.forEach((item) => {
    playlistHtml += `
      <div class="song">
        <div class="player-controls">
          <div class="play-button" id='play-btn' data-aid='${item.id}'></div>
          <div class="pause-button" id='pause-btn' data-aid='${item.id}'></div>
        </div>
        <div class="song-details">
          <div class="song-name">
            ${item.artist} - ${item.title}
          </div>
        </div>
        <div class="download-button"></div>
      </div>
      <div class="divider"></div>
    `
  })
  let songsDiv = document.getElementsByClassName('songs')[0]
  songsDiv.innerHTML = songsDiv.innerHTML + playlistHtml

  document.getElementById('now-playing-title').innerHTML = `${Player.playlist[0].artist} - ${Player.playlist[0].title}`
  document.getElementById('now-playing').dataset.aid = Player.playlist[0].id
  document.getElementById('pause-now-playing').dataset.aid = Player.playlist[0].id
})

document.addEventListener("DOMContentLoaded", () => {

  let songControl = document.getElementById("song-control")
  let songBar = document.getElementsByClassName("song-progress")[0]
  let songCompleted = document.getElementById("song-completed")

  let volumeControl = document.getElementById("volume-control")
  let volumeBar = document.getElementsByClassName("volume-progress")[0]
  let volumeBarRanges = volumeBar.getBoundingClientRect()
  let volumeDotRanges = volumeControl.getBoundingClientRect()
  let volumeCompleted = document.getElementById("volume-completed")

  let CalculatePlayed = (element, bar) => {
    let dot = (element.id === 'song-completed')
      ? songControl.getBoundingClientRect()
      : volumeControl.getBoundingClientRect()
    let percentage = (((dot.left + (dot.width / 2)) - bar.left) * 100) / bar.width
    element.style.width = percentage + '%'
    if (element.id === 'song-completed'){
      if (!Player.rewinding)
        Player.audio.currentTime = (Player.audio.duration * percentage) / 100
    } else {
      Player.audio.volume = percentage / 100
    }
  }

  let ControlVisibility = (element, cond = true) => {
    if (!Player.rewinding) {
      cond === true ? element.style.visibility = 'visible' : element.style.visibility = 'hidden'
    }
  }

  songBar.onmouseover     = ControlVisibility.bind(null, songControl,   true)
  volumeBar.onmouseover   = ControlVisibility.bind(null, volumeControl, true)
  songBar.onmouseout      = ControlVisibility.bind(null, songControl,   false)
  volumeBar.onmouseout    = ControlVisibility.bind(null, volumeControl, false)

  let MovementProgress = (e, bar, barRanges, dotRanges, progress) => {
    e = e || window.event
    let end = 0
    end = e.pageX
    end > barRanges.right ? end = barRanges.right : end
    end < barRanges.left ? end = barRanges.left : end
    diff = end-bar.offsetLeft
    songControl.style.left =  (diff - (dotRanges.width / 2)) + "px"
    CalculatePlayed(progress, barRanges)
  }

  let HandleMovement = (event, bar, songControl, progress) => {
    Player.rewinding = true
    let barRanges = bar.getBoundingClientRect()
    let dotRanges = songControl.getBoundingClientRect()
    document.onmousemove = (e) => {
      MovementProgress(e, bar, barRanges, dotRanges, progress)
    }
    document.onmouseup = () => {
      Player.rewinding = false
      CalculatePlayed(progress, barRanges)
      document.onmousemove = document.onmouseup = null
    }
  }

  let SwitchButtons = (elementToDisplay, aid) => {
    let buttons = document.querySelectorAll(`.pause-button[data-aid="${aid}"], .play-button[data-aid="${aid}"]`)
    forEach(buttons, (index, item) => {
      (item.classList[0] == elementToDisplay) ? item.style.display = 'block' : item.style.display = 'none'
    })
  }

  let ResetButtons = () => {
    forEach(document.querySelectorAll('.pause-button, .play-button'), (index, item) => {
      (item.classList[0] == 'play-button') ? item.style.display = 'block' : item.style.display = 'none'
    })
  }

  let ToggledPlay = (element) => {
    ResetButtons()
    let nowPlaying = document.getElementById('now-playing')
    if (nowPlaying.dataset.aid != element.dataset.aid) {
      let song = Player.getSong(element.dataset.aid)[0]
      document.getElementById('pause-now-playing').dataset.aid = nowPlaying.dataset.aid = song.id
      document.getElementById('now-playing-title').innerHTML = `${song.artist} - ${song.title}`
    }
    SwitchButtons('pause-button', element.dataset.aid)
    Player.play(element.dataset.aid)
  }

  let ToggledPause = (element) => {
    SwitchButtons('play-button', element.dataset.aid)
    Player.stop()
  }

  // Audio Events
  Player.audio.onended = ResetButtons()
  Player.audio.ontimeupdate = () => {
    if (Player.rewinding)
      return

    let percentage = (Player.audio.currentTime * 100) / Player.audio.duration
    document.getElementById("song-completed").style.width = percentage + '%'
    let bar = document.getElementsByClassName("song-progress")[0]
    let control = document.getElementById("song-control")
    control.style.left = ((percentage * bar.offsetWidth) / 100) - (control.offsetWidth / 2)
  }

  // DOM Events
  songBar.addEventListener('click', (e) => {
    MovementProgress(e, songBar, songBar.getBoundingClientRect(), songControl.getBoundingClientRect(), songCompleted)
  })
  document.addEventListener('click', (e) => {
    if (e.target) {
      switch (e.target.classList[0]) {
        case 'play-button':
          ToggledPlay(e.target)
          break
        case 'pause-button':
          ToggledPause(e.target)
          break
      }
    }
  })
  songControl.onmousedown   = HandleMovement.bind(null, event, songBar,   songControl,   songCompleted)
  volumeControl.onmousedown = HandleMovement.bind(null, event, volumeBar, volumeControl, volumeCompleted)
})
