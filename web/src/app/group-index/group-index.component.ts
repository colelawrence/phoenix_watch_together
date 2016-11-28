import { Component, OnInit, OnDestroy, DoCheck, ElementRef } from '@angular/core';

import { Router } from '@angular/router'

import { Subscription } from 'rxjs'

import * as R from '../shared/read';
// import { GroupIndexWriter } from '../core/writers';
import { AppWriter } from '../core/writers';
import { DeviceStateService } from '../core/device-state.service'


@Component({
  template: require('./group-index.component.html'),
  styles: [
    require('./group-index.component.scss')
  ]
})
export class GroupIndexComponent implements OnInit, OnDestroy {
  private _stateSub: Subscription

  groups: R.Group[]

  constructor(
      private _deviceStateService: DeviceStateService,
      // private _groupIndexWriter: GroupIndexWriter,
      private _elt: ElementRef,
      private _router: Router,
      private _appWriter: AppWriter) {
    this._stateSub =
    this._deviceStateService.state.subscribe(deviceState => {
      if (!deviceState.HasLoggedIn) {
        // If not HasLoggedIn, redirect to login route
        window.location.href = "/session/new"
        return
      }

      this.groups = deviceState.LoggedIn.Groups
      /*
      if (deviceState.LoggedIn.OpenGroup) {
        // Redirect to this person's group
        this._router.navigate(["group", deviceState.LoggedIn.Group.GroupId])
        return
      }*/
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
    
  }
}
