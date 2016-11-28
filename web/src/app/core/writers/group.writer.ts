import { Injectable } from '@angular/core';

import * as R from '../../shared/read';
import * as B from './app-resource-interfaces';
import { DeviceStateService } from '../device-state.service'

import { SocketService } from "../phoenix/socket.service"

import {Socket,Channel} from 'phoenix'

type PChannel = Channel & {params: any}

const log2 = (s: string, ...params) => console.log(`%c ${s}`, 'background: #222; color: #bada55', ...params);
const log_ok = (s: string, ...params) => console.log(`%c ${s}`, 'background: #222; color: #bada55', ...params);
const log_error = (s: string, ...params) => console.log(`%c ${s}`, 'background: #222; color: #ff55da', ...params);

@Injectable()
export class GroupWriter {

	private groupChannel: PChannel = null

  constructor(private _dss: DeviceStateService,
  		private phoenix_socket: SocketService) {
    console.log("Created Group Writer")
  }

  // Attempt login takes care of trying logging in, and updating the device state
  sendMessage(messageText: string) {
    // TODO: Send to server with credentials, get feedback from server if changes
    const message: B.Message_messagejson = {
			id: null,
      body: messageText,
      user_id: this._dss.getState().LoggedIn.User.Id,
    }

    this.groupChannel.push("new_message", {message}, 500)
    	.receive("ok", (resp) => log_ok("Sending message ok", resp))
    	.receive("error", (resp) => log_error("Sending message error", resp))
  }
	
  setModalOpen(modalId: "vote-video" | "add-video" | null) {
    let currentState = this._dss.getState()

    if (!currentState.LoggedIn.OpenGroup) return

    currentState.LoggedIn.OpenGroup.ModalOpen = modalId

    this._dss.updateState(currentState)
  }

	leaveGroup() {
    let currentState = this._dss.getState()

    currentState.LoggedIn.OpenGroup = null

    if (this.groupChannel) {
      this.groupChannel.leave()
      this.groupChannel = null
    }

    this._dss.updateState(currentState)
  }

  castSkipVote(hasVote: boolean) {
    let currentState = this._dss.getState()

    let skipVote = currentState.LoggedIn.OpenGroup.SkipVote

		if (skipVote.HasVote) {
      skipVote.VoteCount -= 1
    }
		if (hasVote) {
      skipVote.VoteCount += 1
    }

    skipVote.HasVote = hasVote

    currentState.LoggedIn.OpenGroup.SkipVote = skipVote
    this._dss.updateState(currentState)
  }

	// Play the next video at the top of the proposal list
  playNext() {
    this.groupChannel.push("play_next_video", {}, 500)
    	.receive("ok", (resp) => log_ok("Play next video ok", resp))
    	.receive("error", (resp) => log_error("Play next video error", resp))
  }

  proposeVideo(video: R.Video) {
    const raw_video: B.Video_videojson = {
      id: null,
      yt_id: video.YT_Id,
      name: video.Name,
      thumb: String(video.ThumbnailURL),
      description: video.Desc
    }

    this.groupChannel.push("propose_video", { video: raw_video }, 500)
    	.receive("ok", (resp) => log_ok("Proposing video ok", resp))
    	.receive("error", (resp) => log_error("Proposing video error", resp))
  }

  castVideoVote(video: R.VideoVote, hasVote: boolean) {
    let weight: 1 | 0 = hasVote ? 1 : 0
    console.log("cast vote", video)
    this.putVoteLookup(video.ProposalId, weight)
    this.groupChannel.push("cast_vote_proposal",
    		{ proposal_id: video.ProposalId, weight }, 500)
    	.receive("ok", (resp) => log_ok("Cast vote ok", resp))
    	.receive("error", (resp) => log_error("Cast vote error", resp))
  }

  setOpenGroup(groupId: string) {
		this.joinGroupChannel(groupId)
  }

	// PRIVATE
	// LISTENERS & JOIN


	private raw_users: B.User_userjson[]

	private onNewMessage({message}: {message: B.Message_messagejson}) {
    this.groupChannel.params.last_seen_id = message.id

    let currentState = this._dss.getState()

    const postMessage: R.GroupMessage = B.GroupMessage(message, this.raw_users)

    currentState.LoggedIn.OpenGroup.Messages.unshift(postMessage)

    this._dss.updateState(currentState)
  }

	private onUpdateProposals({proposals}: {proposals: B.GroupVideoProposal_group_video_proposaljson[]}) {
    let currentState = this._dss.getState()

    // TODO remember whether you voted or not! or get it with the updates...    
    currentState.LoggedIn.OpenGroup.VideoVotes = proposals.map((p) => B.VideoVote(p, this.hasVote(p.id) > 0))

    this._dss.updateState(currentState)
  }

	// CHANGE USERS
	private onUpdateUsers({users}: {users: B.User_userjson[]}) {
    let currentState = this._dss.getState()
    // Keep track of the raw users, so we can refer back to them.
		// If a user leaves, then will their comments not show??
    this.raw_users = users

    currentState.LoggedIn.OpenGroup.Group.Users = users.map(B.User)

    this._dss.updateState(currentState)
  }

	// CHANGE VIDEO
	private onUpdatePlaying({playing}: {playing: B.GroupVideoProposal_group_video_proposaljson}) {
    let currentState = this._dss.getState()
    console.log("Update Playing Video", playing)
    currentState.LoggedIn.OpenGroup.Group.Playing = B.VideoVote(playing, false)
    this._dss.updateState(currentState)
  }

	// PLAY
	private onUpdatePlayerPlay({started_at}: {started_at: string}) {
    let currentState = this._dss.getState()
    currentState.LoggedIn.OpenGroup.Group.State = "play"
    currentState.LoggedIn.OpenGroup.Group.PlayStartedAt = started_at
    this._dss.updateState(currentState)
  }

	// PAUSE
	private onUpdatePlayerPause({pause_at}: {pause_at: number}) {
    let currentState = this._dss.getState()
    currentState.LoggedIn.OpenGroup.Group.State = "pause"
    currentState.LoggedIn.OpenGroup.Group.PausePlayerAt = pause_at
    this._dss.updateState(currentState)
  }

  private joinGroupChannel(groupId: string) {
    if (this.groupChannel) {
      this.groupChannel.leave()
    }
	
  	// Need PChannel because typings we had did not allow [params]
    this.groupChannel = <PChannel> this.phoenix_socket.socket.channel(`groups:${groupId}`)
		
    this.groupChannel.on('new_message', (resp) => this.onNewMessage(resp))
    this.groupChannel.on('update_proposals', (resp) => this.onUpdateProposals(resp))
    this.groupChannel.on('update_playing', (resp) => this.onUpdatePlaying(resp))
    this.groupChannel.on('update_player_pause', (resp) => this.onUpdatePlayerPause(resp))
    this.groupChannel.on('update_player_play', (resp) => this.onUpdatePlayerPlay(resp))
    this.groupChannel.on('update_users', (resp) => this.onUpdateUsers(resp))

    this.groupChannel.join()
      .receive("ok", ({group, users, messages, proposals}) => {
        log2("Joined Group Channel", group, users, messages, proposals)
        // TODO Relocate this logic...
        let currentState = this._dss.getState()

				this.raw_users = users

        currentState.LoggedIn.OpenGroup = {
          Group: B.Group(group, users),
          Messages: messages.map(m => B.GroupMessage(m, users)),
          ModalOpen: null,
          VideoVotes: (proposals || []).map(B.VideoVote),
          SkipVote: null,
        }

				// Keep track of these ids, in case we lose connection and need to reconnect. 
        let msg_ids = messages.map(msg => msg.id)
        if (msg_ids.length > 0)
          this.groupChannel.params.last_seen_message_id = Math.max(...msg_ids)

        this._dss.updateState(currentState)
      })
      .receive("error", reason => console.log("Join Failed", reason))
  
  }

	private proposal_votes: [string, 1 | 0 | -1][] = []
  private hasVote (proposal_id): 1 | 0 | -1 {
    let prop = this.proposal_votes.find(([id]) => id === proposal_id)

    return prop ? prop[1] : 0
  }
  // This is our private way of keeping track of votes we have made...
  private putVoteLookup (proposal_id, weight: 1 | 0 | -1) {
    let prop = this.proposal_votes.find(([id]) => id === proposal_id)

    if (prop) prop[1] = weight
    else this.proposal_votes.push([proposal_id, weight])
  }


	/*
  castTimeVote(time: R.Vote, hasVote: boolean) {
    let currentState = this._dss.getState()

    let timeVotes = currentState.LoggedIn.OpenGroup.TimeVotes

    currentState.LoggedIn.OpenGroup.TimeVotes = this.castVote(timeVotes, time, hasVote)
    this._dss.updateState(currentState)
  }
  */

  private castVote(votes: R.VideoVote[], cast: R.VideoVote, hasVote: boolean): R.VideoVote[] {
    return votes.map(v => {
      const hadVote = v.HasVote
      if (v.ProposalId === cast.ProposalId) {
        v.HasVote = hasVote
        // How to change the number of votes
        const change = hadVote === hasVote ? 0 : hasVote ? 1 : -1;
        v.VoteCount += change
      }
      return v
    })
  }
}
