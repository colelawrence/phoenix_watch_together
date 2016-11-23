
import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as R from '../shared/read';

import * as Mocks from './device-state-mocks'

const mergeWith = <(obj: any, source: any, customizer: (objValue, srcValue) => any) => any> require('lodash.mergewith')

// https://lodash.com/docs/4.16.4#mergeWith
// In the future, we may be interested in customizing this further
// for better support of large message arrays maybe.
function mergeExceptArrays (objValue, srcValue) {
  if (objValue instanceof Array && srcValue instanceof Array) {
    return srcValue
  }
}

@Injectable()
export class DeviceStateService {

  private _state: R.DeviceState
  private stateObserver: Observer<R.DeviceState>

  public state: Observable<R.DeviceState>

  constructor() {
    this.state = Observable.create(observer => {
      this.stateObserver = observer
      // Any cleanup logic might go here
      return () => console.log('disposed device state service')
    });
  }

  setState(newState: R.DeviceState) {
    if (!newState) { throw new Error("setState received undefined state") }

    this._state = newState
    this.next()
  }

  updateState(stateChanges: R.DeviceState) {
    if (!stateChanges) { throw new Error("updateState received undefined state") }

    // Special merge update of traits
    mergeWith(this._state, stateChanges, mergeExceptArrays)

    this.next()
  }

  getState() {
    return this._state
  }

  next() {
    this.stateObserver.next(this._state)
  }

  setMockState(id: string) {
    let newState = Mocks.getState(id)
    if (newState) {
      console.log(`Mock state set to "${id}".`)
      this.setState(newState)
    } else {
      console.warn(`Mock state with id "${id}" not found.`)
    }
  }

  getMockStateIds(): string[] {
    return Mocks.StateKeys
  }

  setDefaultState() {
    this.setState(Mocks.getState("GroupOpened"))
    // this.setState({
    //   HasLoggedIn: false,
    //   NotLoggedIn: {
    //     HasLoggedOutShown: false
    //   }
    // })
  }
}
