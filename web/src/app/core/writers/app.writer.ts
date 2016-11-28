import { Injectable } from '@angular/core';

import * as R from '../../shared/read';
import * as B from './app-resource-interfaces';

import { DeviceStateService } from '../device-state.service'

import { SocketService } from "../phoenix/socket.service"

import {Socket,Channel} from 'phoenix'

interface appOk {
  ytkey: string,
  user: B.User_userjson,
  groups: B.Group_groupjson[],
  users: B.User_userjson[]
}

@Injectable()
export class AppWriter {

	private appChannel: Channel

  constructor(private _dss: DeviceStateService,
  		private phoenix_socket: SocketService) {
    console.log("Created App Writer")
    this.appChannel = this.phoenix_socket.socket.channel('app')

    this.appChannel.join()
    	.receive("ok", ({ytkey, groups, users, user}: appOk) => {
        console.log("Connected to app channel.")

        let currentState = this._dss.getState()
        currentState.LoggedIn.YTApiKey = ytkey
        currentState.LoggedIn.User = B.User(user)

				const getUser = (id) => users.find(u => u.id == id)

				// Convert the raw data to our ui data
        currentState.LoggedIn.Groups = groups.map(g => B.Group(g, users))

        this._dss.updateState(currentState)
      })
    	.receive("error", ({reason}) => {
        console.error("Could not connect to app channel.", reason)
      })
    
    this.appChannel.on("leave_group", (resp) => {
			console.debug("TODO handle leaving group request from server", resp)
    })

    this.appChannel.on("join_group", (resp) => {
			console.debug("TODO handle joining group request from server", resp)
    })
	}

	leaveGroup(groupId: string) {
    this.appChannel.push("leave_group", {groupId}, 3000)
    	.receive("error", err => console.error(err))
  }
}
