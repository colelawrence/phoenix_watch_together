
declare const window: Window & {onYouTubeIframeAPIReady: Function}
declare const YT: any

export
class Player {
  player: any

  constructor (domId: string, playerId: string, onReady: Function) {
    window.onYouTubeIframeAPIReady = () =>
      this.onIframeReady(domId, playerId, onReady)
    
    let youtubeScriptTag = document.createElement("script")
    youtubeScriptTag.src = "//www.youtube.com/iframe_api"
    document.head.appendChild(youtubeScriptTag)
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

  onPlayerStateChange(event) {
    console.log("PlayerStateChange", event)
  }

  getCurrentTime() {
    return Math.floor(this.player.getCurrentTime() * 1000)
  }

  seekTo(ms) {
    return this.player.seekTo(ms / 1000)
  }
}
