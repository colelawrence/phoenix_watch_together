declare const window: Window & {userToken: string}

import { Injectable } from '@angular/core';

import * as R from '../../shared/read';
import { DeviceStateService } from '../device-state.service'

import {Socket, Channel} from 'phoenix'

@Injectable()
export class SocketService {
  public socket: Socket
  constructor(){
    this.socket = new Socket("/socket", {
      params: {token: window.userToken},
      logger: (kind, msg, data) => {
        console.log(`${kind}:`, msg, data)
      }
    })

    this.socket.connect()
  }
}
