import { Injectable } from '@angular/core';

import * as R from '../../shared/read';
import { DeviceStateService } from '../device-state.service'

import { SocketService } from "../phoenix/socket.service"

import {Socket,Channel} from 'phoenix'

@Injectable()
export class GroupWriter {

	private pingChannel: Channel

  constructor(private _dss: DeviceStateService,
  		private phoenix_socket: SocketService) {
    console.log("Created Group Writer")
    this.pingChannel = this.phoenix_socket.socket.channel('ping')
    
    this.pingChannel.on('pong', ({message}) => {
      let currentState = this._dss.getState()

      const postMessage: R.GroupMessage = {
        Date: new Date(),
        Text: 'Server Heartbeat\n' + String(message),
        User: {Name: "Server"}
      }

      currentState.LoggedIn.Group.Messages.unshift(postMessage)

      this._dss.updateState(currentState)
    })

    this.pingChannel.join()
      .receive("ok", (resp) => {
        console.log("Joined the Ping Channel", resp)
        // TODO Relocate this logic...
        let currentState = this._dss.getState()

        currentState.LoggedIn.Group.YTApiKey = this.phoenix_socket.ytkey

        this._dss.updateState(currentState)				
      })
      .receive("error", reason => console.log("Join Failed", reason))
  }

  // Attempt login takes care of trying logging in, and updating the device state
  sendMessage(messageText: string) {
    // TODO: Send to server with credentials, get feedback from server if changes
    let currentState = this._dss.getState()

    const message: R.GroupMessage = {
      Date: new Date(),
      Text: messageText,
      User: currentState.LoggedIn.User
    }

    currentState.LoggedIn.Group.Messages.unshift(message)

		if (messageText.toLowerCase().indexOf('ping') > -1) {
      this.pingChannel.push('ping', {})
      								.receive("error", e => console.error(e) )
    }

    this._dss.updateState(currentState)
  }
	
  setModalOpen(modalId: "vote-video" | "add-video" | null) {
    let currentState = this._dss.getState()

    currentState.LoggedIn.Group.ModalOpen = modalId

    this._dss.updateState(currentState)
  }

	leaveGroup() {
    let currentState = this._dss.getState()

    currentState.LoggedIn.Group = null

    this._dss.updateState(currentState)
  }

  castSkipVote(hasVote: boolean) {
    let currentState = this._dss.getState()

    let skipVote = currentState.LoggedIn.Group.SkipVote

		if (skipVote.HasVote) {
      skipVote.VoteCount -= 1
    }
		if (hasVote) {
      skipVote.VoteCount += 1
    }

    skipVote.HasVote = hasVote

    currentState.LoggedIn.Group.SkipVote = skipVote
    this._dss.updateState(currentState)
  }

  castVideoVote(video: R.VideoVote, hasVote: boolean) {
    let currentState = this._dss.getState()

    let videoVotes = currentState.LoggedIn.Group.VideoVotes

    currentState.LoggedIn.Group.VideoVotes = this.castVote(videoVotes, video, hasVote)
    this._dss.updateState(currentState)
  }

	/*
  castTimeVote(time: R.Vote, hasVote: boolean) {
    let currentState = this._dss.getState()

    let timeVotes = currentState.LoggedIn.Group.TimeVotes

    currentState.LoggedIn.Group.TimeVotes = this.castVote(timeVotes, time, hasVote)
    this._dss.updateState(currentState)
  }
  */

  private castVote(votes: R.VideoVote[], cast: R.VideoVote, hasVote: boolean): R.VideoVote[] {
    return votes.map(v => {
      const hadVote = v.HasVote
      if (v.Id === cast.Id) {
        v.HasVote = hasVote
        // How to change the number of votes
        const change = hadVote === hasVote ? 0 : hasVote ? 1 : -1;
        v.VoteCount += change
      }
      return v
    })
  }
}
