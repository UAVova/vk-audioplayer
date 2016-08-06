class Player {

  constructor() {
    this.playlist = []
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
    } else {
        if (!this.currentSongId) {
          this.currentSongId = this.playlist[0].id
          this.audio.src = this.playlist[0].url
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

  getNextSong() {
    if (this.currentSongId){
      let i = this.findIndex(this.currentSongId)
      if (i >= 0) {
        i = (i + 1) > (this.playlist.length - 1) ? 0 : i + 1
        return this.playlist[i]
      }
    }
    return false
  }

  findIndex(id) {
    for (let i = 0; i < this.playlist.length; i++) {
      if (this.playlist[i].id == id)
        return i
    }
    return -1
  }


}

module.exports = Player
