import { Component, OnInit, OnDestroy, DoCheck, ElementRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router'

import { Subscription } from 'rxjs'

import * as R from '../shared/read';
import { GroupWriter } from '../core/writers';
import { DeviceStateService } from '../core/device-state.service'

import { ResultVideoItem } from './youtube-video-search/youtube-video-search.component'

import {Player} from './player'

@Component({
  template: require('./group.component.html'),
  styles: [
    require('./group.component.scss'),
    require('./group-voting.scss')
  ]
})
export class GroupComponent implements OnInit, OnDestroy, DoCheck {
  private _lastScrolledInMessage: any

  messageInput: string
  YTApiKey: string

  private _stateSub: Subscription
  private _arSub: Subscription
  private _coolDownUntil: number
  topVideo: R.VideoVote
  group: R.OpenGroup
  player: Player

  constructor(
      private _deviceStateService: DeviceStateService,
      private _groupWriter: GroupWriter,
      private _activatedRoute: ActivatedRoute,
      private _elt: ElementRef,
      private _router: Router) {

    this._arSub =
		this._activatedRoute.params.subscribe(({id}) => {
      console.log(`Get route "${id}"`)
      this._groupWriter.setOpenGroup(id)
    })

    this._stateSub =
    this._deviceStateService.state.subscribe(deviceState => {
      if (!deviceState.HasLoggedIn) {
        // If not HasLoggedIn, redirect to login route
        window.location.href = "/session/new"
        return
      }

      this.YTApiKey = deviceState.LoggedIn.YTApiKey

      this.group = deviceState.LoggedIn.OpenGroup

      console.log("UpdateState: this.group.Group", this.group && this.group.Group)
			if (this.group && this.group.Group.Playing) {
        let isPlaying = this.group.Group.State === "play"
        let seekTo = 0
        if (isPlaying) {
          seekTo = this.diffStartedAt(this.group.Group.PlayStartedAt)
        } else {
          seekTo = this.group.Group.PausePlayerAt
        }
				let videoId = this.group.Group.Playing.Video.YT_Id
        if (this.player) {
          this.startCoolDown()
          this.player.setPlaying(isPlaying)
          const currentUrl = this.player.player && this.player.player.getVideoUrl()
          if (!currentUrl || currentUrl.indexOf(videoId) === -1) {
            this.player.loadVideoId(videoId, seekTo)
          } else {
            // Same video

            // Check if video is in different time then our model expects
            let diff = Math.abs(this.player.getCurrentTime() - seekTo)

            if (diff > 2000) {
							// seekTo if time is diff greater than 2 seconds
              console.log("Player became out of sync", diff)
              this.player.seekTo(seekTo)
            }
          }
        } else {
          // Set up Youtube Player
          this.player = new Player("group-video", videoId, () => {
            this.startCoolDown()
            this.player.seekTo(seekTo)
            this.player.setPlaying(isPlaying)

            this.player.onstatechange = ({ data: state }) => {
							let currentTime = this.player.getCurrentTime()

							let send = true
              if (this._coolDownUntil > Date.now()) send = false
              else this._coolDownUntil = 0

              console.log("Player State", ["unstarted","ended","playing","paused","buffering",null,"cued"][state+1])
              switch(state) {
                case 2:
                  console.log("++++STOPPED Send:", send)
                  send && setTimeout(() => this._groupWriter.pauseAt(currentTime), 10)
                  break
                case 1:
                  console.log("++++PLAYING Send:", send)
                  send && setTimeout(() => this._groupWriter.playAt(currentTime), 10)
                  break
              }
            }
          })
        }
      } else {
        if (this.player) this.player.setPlaying(false)
      }
    })
  }

	// Set a cooldown timer for sending updates to the backend
	private startCoolDown(){
    // one sec in the future
    this._coolDownUntil = Date.now() + 1000
  }

  diffStartedAt(started_at_utc: string) {
    let utc_ms = Date.parse(started_at_utc)
    let started_at = new Date(utc_ms)
		let diff = Date.now() - utc_ms
    return diff
  }

  ngOnInit() {
    this._deviceStateService.next()

    const elt = <HTMLElement> document.body
    const checkToDismiss = ({target}) => {
      let childOfVote: boolean
      let childOfAddVideo: boolean
      let hasModalParent = null != findParent(
        <HTMLElement> target, // start node
        (t) => { // Test to find parent
          childOfVote = -1 < t.className.indexOf("vote-")
          childOfAddVideo = -1 < t.tagName.toLowerCase().indexOf("youtube-video-search")
          return childOfVote || childOfAddVideo
        })
      if (!hasModalParent) {
        this.closeModal()
      }
    }
    elt.addEventListener("touchstart", checkToDismiss)
    elt.addEventListener("mousedown", checkToDismiss)
  }

  private closeModal() {
    this._groupWriter.setModalOpen(null)
  }

  ngOnDestroy () {
    // Remove subscription to free up resources
    this._stateSub.unsubscribe()
    this._arSub.unsubscribe()
  }

  ngDoCheck() {
    if (!this.group) return

    // If the latest message changes, scroll to it.
    const elt = <HTMLElement> this._elt.nativeElement
    const lastMessage = elt.querySelector(".message:last-child")
    if (lastMessage && this._lastScrolledInMessage !== lastMessage) {
      // Magic scroll function ships with HTML JSDOM
      lastMessage.parentElement.scrollTop = lastMessage.parentElement.scrollHeight
      this._lastScrolledInMessage = lastMessage
    }

    // update top votes
    // TODO Top Video Votes
    if (this.group.VideoVotes.length) {
      this.topVideo = this.group.VideoVotes.reduce((prev, curr) => curr.VoteCount > prev.VoteCount ? curr : prev)
    } else {
      this.topVideo = null
    }
  }

	clickLeaveGroup() {
    this._groupWriter.leaveGroup()
    this._router.navigate(['/group-index'])
  }

	clickPlayNext() {
    this._groupWriter.playNext()
  }

  sendMessage(messageText: string) {
    this._groupWriter.sendMessage(messageText)
  }

  clickVoteVideo() {
    this._groupWriter.setModalOpen('vote-video')
  }

  clickAddVideo() {
    this._groupWriter.setModalOpen('add-video')
  }

  setVoteVideo(video: R.VideoVote, vote: boolean) {
    this._groupWriter.castVideoVote(video, vote)
  }

  proposeVideo(youtube_video: ResultVideoItem) {
    this._groupWriter.proposeVideo(<R.Video> {
      Id: null,
      YT_Id: youtube_video.yt_id,
      Name: youtube_video.title,
      Desc: youtube_video.desc,
      ThumbnailURL: youtube_video.thumbnails.medium.url,
    })
    // TODO send to groupwriter
    // this._groupWriter.
  }

  clickSendMessage() {
    if (this.messageInput.length) {
      this.sendMessage(this.messageInput)
      this.messageInput = ""
    }
  }
}

function findParent(element: HTMLElement, test: (testElt: HTMLElement) => boolean) {
  let t = <HTMLElement> { parentElement: element }
  while (t.parentElement) {
    if (!t.parentElement) {
      break;
    }
    t = t.parentElement
    if (test(t)) {
      return t
    }
  }
  return null
}
