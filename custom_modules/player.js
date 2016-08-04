class Player {

  constructor() {
    this.playlist = {}
    this.audio = new Audio();
    this.currentSongId = null
    this.isPlaying = false
    this.rewinding = false
  }

  play(songId) {
    if (songId) {
      if (this.currentSongId != songId) {
        let currentSong = this.getSong(songId)
        this.currentSongId = currentSong[0].id
        this.audio.src = currentSong[0].url
      }
    }
    this.audio.play()
    this.isPlaying = true
  }

  getSong(songId) {
    return this.playlist.filter( (item) => { return item.id == songId } )
  }

  stop() {
    if (this.isPlaying) {
      this.audio.pause()
      this.isPlaying = false
    }
  }


}

module.exports = Player
