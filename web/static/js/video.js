
import { Player } from "./player"

export
class Video {
  constructor(socket, element) {
    if (!element) return null
    const playerId = element.dataset.playerId
    const videoId = element.dataset.id

    socket.connect()
    this.player = new Player(element.id, playerId, () => {
      this.onReady(videoId, socket)
    })
  }

  onReady(videoId, socket) {
    const msgContainer = document.getElementById("msg-container")
    const msgInput     = document.getElementById("msg-input")
    const postButton   = document.getElementById("msg-submit")
    const vidChannel   = socket.channel(`videos:${videoId}`)

    postButton.addEventListener("click", () => {
      const payload = {body: msgInput.value, at: this.player.getCurrentTime()}
      vidChannel.push("new_annotation", payload)
                .receive("error", e => console.error(e) )

      msgInput.value = ""
    })

    // Listen to events
    vidChannel.on("ping", ({count}) => console.log(`PING ${count}`))
    vidChannel.on("new_annotation", resp => {
      this.renderAnnotation(msgContainer, resp)
    })

    vidChannel.join()
      .receive("ok", resp => console.log("Joined the Video Channel", resp))
      .receive("error", reason => console.log("Join Failed", reason))
  }

  renderAnnotation(container, {user, body, at}) {
    let template = document.createElement("div")
    const strAt = this.esc(at)
    template.innerHTML = `
      <a href="#" data-seek="${strAt}">
        <i>[${strAt}]</i>&nbsp;<b>${this.esc(user.username)}</b>, ${this.esc(body)}
      </a>
    `

    container.appendChild(template)
    container.scrollTop = container.scrollHeight
  }

  esc (str) {
    let div = document.createElement("div")
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }
}
