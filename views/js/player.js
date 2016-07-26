document.addEventListener("DOMContentLoaded", () => {

  let songControl = document.getElementById("song-control")
  let songBar = document.getElementsByClassName("song-progress")[0]
  let songBarRanges = songBar.getBoundingClientRect()
  let songDotRanges = songControl.getBoundingClientRect()
  let songCompleted = document.getElementById("song-completed")

  let volumeControl = document.getElementById("volume-control")
  let volumeBar = document.getElementsByClassName("volume-progress")[0]
  let volumeBarRanges = volumeBar.getBoundingClientRect()
  let volumeDotRanges = volumeControl.getBoundingClientRect()
  let volumeCompleted = document.getElementById("volume-completed")
  let moving = false;

  let CalculatePlayed = (element, bar) => {
    let dot = (element.id === 'song-completed')
      ? songControl.getBoundingClientRect()
      : volumeControl.getBoundingClientRect()
    element.style.width = ((((dot.left - bar.left) * 100) / bar.width) + 2) + '%'
  }

  let ControlVisibility = (element, cond = true) => {
    if ( !moving ) {
      cond === true ? element.style.display = 'block' : element.style.display = 'none'
    }
  }

  songBar.onmouseover     = ControlVisibility.bind(null, songControl,   true)
  volumeBar.onmouseover   = ControlVisibility.bind(null, volumeControl, true)
  songBar.onmouseout      = ControlVisibility.bind(null, songControl,   false)
  volumeBar.onmouseout    = ControlVisibility.bind(null, volumeControl,   false)


  let HandleMovement = (event, bar, barRanges, dotRanges, songControl, progress) => {
    event = event || window.event
    moving = true
    document.onmousemove = (e) => {
        e = e || window.event
        let end = 0
        if( !e.pageX) {
          end = e.clientX
        }
        end = e.pageX
        end > (barRanges.right - 5) ? end = (barRanges.right - 5) : end
        end < barRanges.left ? end = barRanges.left : end
        diff = end-bar.offsetLeft
        songControl.style.left =  (diff - (dotRanges.width / 2)) + "px"
        CalculatePlayed(progress, barRanges)
    }
    document.onmouseup = () => {
        CalculatePlayed(progress, barRanges)
        moving = false
        document.onmousemove = document.onmouseup = null
    }
  }

  songControl.onmousedown   = HandleMovement.bind(null, event, songBar,   songBarRanges,   songDotRanges,   songControl,   songCompleted)
  volumeControl.onmousedown = HandleMovement.bind(null, event, volumeBar, volumeBarRanges, volumeDotRanges, volumeControl, volumeCompleted)
})
