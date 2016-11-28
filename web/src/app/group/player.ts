
declare const window: Window & {onYouTubeIframeAPIReady: Function}
declare const YT: any

export
class Player {
  player: any

  constructor (domId: string, playerId: string, onReady: Function) {
    if (window["YT"] != null) {
      this.onIframeReady(domId, playerId, onReady)

    } else {
      window.onYouTubeIframeAPIReady = () =>
        this.onIframeReady(domId, playerId, onReady)
      
      let youtubeScriptTag = document.createElement("script")
      youtubeScriptTag.src = "//www.youtube.com/iframe_api"
      document.head.appendChild(youtubeScriptTag)
    }
  }

  onIframeReady(domId, playerId, onReady) {
    this.player = new YT.Player(domId, {
      width: "420", height: "360", videoId: playerId,
      events: {
        "onReady": (event => onReady(event)),
        "onStateChange": (event => this.onPlayerStateChange(event))
      }
    })
  }

	loadVideoId(videoId: string, start_at = 0) {
    this.player.loadVideoById(videoId, start_at / 1000, "default")
  }

  onPlayerStateChange(event) {
    console.log("PlayerStateChange", event)
  }

  getCurrentTime() {
    return Math.floor(this.player.getCurrentTime() * 1000)
  }

  seekTo(ms) {
    return this.player.seekTo(ms / 1000)
  }

	setPlaying(is_playing: boolean) {
    if (is_playing) this.player.playVideo()
    else this.player.pauseVideo()
  }

  seekToStartedAt(started_at_utc: string) {
    let utc_ms = Date.parse(started_at_utc)
    let started_at = new Date(utc_ms)
		let diff = Date.now() - utc_ms
		console.log("started_at_utc", started_at)
		console.log("diff", diff)
    this.seekTo(diff)
  }
}
