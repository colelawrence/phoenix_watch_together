import { Injectable } from '@angular/core';

import * as R from '../../shared/read';
import { DeviceStateService } from '../device-state.service'

@Injectable()
export class GroupWriter {

  constructor(private _dss: DeviceStateService) {
    console.log("Created Group Writer")
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

    console.log("sending", messageText)

    this._dss.updateState(currentState)
  }
	
  setModalOpen(modalId: "video" | null) {
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
