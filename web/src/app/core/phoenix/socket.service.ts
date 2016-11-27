declare const window: Window & {userToken: string}

import { Injectable } from '@angular/core';

import * as R from '../../shared/read';
import { DeviceStateService } from '../device-state.service'

import {Socket, Channel} from 'phoenix'

@Injectable()
export class SocketService {
  public socket: Socket
  public ytkey: string = null
  private appChannel: Channel
  constructor(){
    this.socket = new Socket("/socket", {
      params: {token: window.userToken},
      logger: (kind, msg, data) => {
        console.log(`${kind}:`, msg, data)
      }
    })

    this.socket.connect()

    this.appChannel = this.socket.channel("app")

    this.appChannel.join()
    	.receive("ok", ({ytkey}) => {
        this.ytkey = ytkey
        console.log("Connected to app channel.")
      })
    	.receive("error", ({reason}) => {
        console.error("Could not connect to app channel.", reason)
      })
  }
}
