
import { Player } from "./player"

export
class Video {
  constructor(socket, element) {
    if (!element) return null
    const playerId = element.dataset.playerId
    const videoId = element.dataset.id

    socket.connect()

    this.isOpened = false
    this.watchContainer = document.getElementById("watch-container")

    socket.onOpen( ev => { console.debug("OPEN", ev); this.onOpen() })
    socket.onError( ev => console.error("ERROR", ev) )
    socket.onClose( e => { console.log("CLOSE", e); this.onClose() })

    this.player = new Player(element.id, playerId, () => {
      this.onReady(videoId, socket)
    })

    this.updateView()
  }

  onOpen() {
    if (!this.isOpened) {
      this.isOpened = true
      this.updateView()
    }
  }
  onClose() {
    if (this.isOpened) {
      this.isOpened = false
      this.updateView()
    }
  }

  updateView() {
    this.watchContainer.dataset.isConnected = this.isOpened
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
    vidChannel.on("new_annotation", resp => {
      vidChannel.params.last_seen_id = resp.id
      this.renderAnnotation(msgContainer, resp)
    })

    // Listen for clicking annotations
    msgContainer.addEventListener("click", evt => {
      evt.preventDefault()
      let millisec = evt.target.getAttribute("data-seek") ||
                     evt.target.parentNode.getAttribute("data-seek")

      if (!millisec) { return }

      this.player.seekTo(millisec)
    })

    vidChannel.join()
      .receive("ok", ({annotations}) => {
        let ann_ids = annotations.map(ann => ann.id)
        if (ann_ids.length > 0)
          vidChannel.params.last_seen_id = Math.max(...ann_ids)

        this.scheduleAnnotations(msgContainer, annotations)
        console.log("Joined the Video Channel")
      })
      .receive("error", reason => console.log("Join Failed", reason))
  }

  scheduleAnnotations(msgContainer, annotations) {
    setInterval(() => {
      let ctime = this.player.getCurrentTime()
      annotations = annotations.filter((ann) => {
        let {at} = ann
        if (at < ctime) this.renderAnnotation(msgContainer, ann)
        else return true
      })
    }, 200)
  }

  renderAnnotation(container, {user, body, at}) {
    let template = document.createElement("div")
    const strAt = this.esc(at)
    template.innerHTML = `
      <a href="#" data-seek="${strAt}">
        <i>[${this.fmtTime(at)}]</i>&nbsp;<b>${this.esc(user.username)}</b>, ${this.esc(body)}
      </a>
    `

    container.appendChild(template)
    container.scrollTop = container.scrollHeight
  }

  fmtTime(at) {
    const date = new Date(null)
    date.setSeconds(at / 1000)
    return date.toISOString().substr(14, 5)
  }

  esc(str) {
    let div = document.createElement("div")
    div.appendChild(document.createTextNode(str))
    return div.innerHTML
  }
}
