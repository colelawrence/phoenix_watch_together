import { Component, OnInit, OnDestroy, DoCheck, ElementRef } from '@angular/core';

import { Router } from '@angular/router'

import { Subscription } from 'rxjs'

import * as R from '../shared/read';
import { GroupWriter } from '../core/writers';
import { DeviceStateService } from '../core/device-state.service'

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
  ytApiKey: string

  private _stateSub: Subscription;
  topVideo: R.VideoVote
  group: R.Group
  player: Player

  constructor(
      private _deviceStateService: DeviceStateService,
      private _groupWriter: GroupWriter,
      private _elt: ElementRef,
      private _router: Router) {
    this._stateSub =
    this._deviceStateService.state.subscribe(deviceState => {
      if (!deviceState.HasLoggedIn) {
        // If not HasLoggedIn, redirect to login route
        window.location.href = "/session/new"
        return
      }

      let isNotInGroup = deviceState.LoggedIn.Group == null
      if (isNotInGroup) {
        console.warn("Device State is not in Group")
        this._router.navigate(['/group-index'])
        return
      }

      this.group = deviceState.LoggedIn.Group

      this.player = new Player("group-video", this.group.Playing.URL, () => {
        console.log("Player ready!")
      })
    })
  }

	clickLeaveGroup() {
    this._groupWriter.leaveGroup()
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
  }

  ngDoCheck() {
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
    this.topVideo = this.group.VideoVotes.reduce((prev, curr) => curr.VoteCount > prev.VoteCount ? curr : prev)
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

  proposeVideo(youtube_video_id: string) {
    console.log("Proposing", youtube_video_id)
    this._groupWriter.sendMessage(youtube_video_id)
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
