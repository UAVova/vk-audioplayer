class Player {

  constructor() {
    this.playlist = {}
    this.player = new Audio();
    this.currentSongId = null
    this.isPlaying = false
  }

  play(songId) {
    if (songId) {
      if (this.currentSongId != songId) {
        let currentSong = this.getSong(songId)
        this.currentSongId = currentSong[0].id
        this.player.src = currentSong[0].url
      }
    }
    this.player.play()
    this.isPlaying = true
  }

  getSong(songId) {
    return this.playlist.filter( (item) => { return item.id == songId } )
  }

  stop() {
    if (this.isPlaying) {
      this.player.pause()
      this.isPlaying = false
    }
  }


}

module.exports = Player
