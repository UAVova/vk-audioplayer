class Player {

  constructor() {
    this.playlist = {}
    this.player = new Audio();
    this.nowPlaying = null
  }

  play(songId) {
    if (songId) {
      if (this.nowPlaying != songId) {
        let currentSong = this.getSong(songId)
        this.nowPlaying = currentSong[0].id
        this.player.src = currentSong[0].url
      }
    }
    this.player.play()
  }

  getSong(songId) {
    return this.playlist.filter( (item) => { return item.id == songId } )
  }

  stop() {
    if (this.nowPlaying) {
      this.player.pause()
    }
  }


}

module.exports = Player
