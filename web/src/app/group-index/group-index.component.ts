import { Component, OnInit, OnDestroy, DoCheck, ElementRef } from '@angular/core';

import { Router } from '@angular/router'

import { Subscription } from 'rxjs'

import * as R from '../shared/read';
// import { GroupIndexWriter } from '../core/writers';
import { DeviceStateService } from '../core/device-state.service'


@Component({
  template: require('./group-index.component.html'),
  styles: [
    require('./group-index.component.scss')
  ]
})
export class GroupIndexComponent implements OnInit, OnDestroy {
  private _stateSub: Subscription

  constructor(
      private _deviceStateService: DeviceStateService,
      // private _groupIndexWriter: GroupIndexWriter,
      private _elt: ElementRef,
      private _router: Router) {
    this._stateSub =
    this._deviceStateService.state.subscribe(deviceState => {
      if (!deviceState.HasLoggedIn) {
        // If not HasLoggedIn, redirect to login route
        window.location.href = "/session/new"
        return
      }
      if (deviceState.LoggedIn.Group) {
        // Redirect to this person's group
        this._router.navigate(["group"])
        return
      }
    })
  }

  ngOnInit () {
    this._deviceStateService.next()
  }

  ngOnDestroy () {
    // Remove subscription to free up resources
    this._stateSub.unsubscribe()
  }

  clickGroupIndex() {
    // this._groupIndexWriter.attemptGroupIndex()
  }
}
