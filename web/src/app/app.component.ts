import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { DeviceStateService } from './core/device-state.service'
import { DeviceState, LanguageType } from './shared/read'

@Component({
  selector: 'wt-app', // <wt-app></wt-app>
  template: require('./app.component.html'),
  styles: [require('./app.component.scss')],
})
export class AppComponent implements OnInit, OnDestroy {

  deviceState: DeviceState

  private _stateSub: Subscription;

  constructor(private _deviceStateService: DeviceStateService) {
    this._stateSub =
    this._deviceStateService.state.subscribe(deviceState => {
      this.deviceState = deviceState
    })

    console.log("AppComponent", this._deviceStateService.getState())

    if (!this._deviceStateService.getState()) {
      this._deviceStateService.setDefaultState()
    }
  }

  ngOnInit () {
    //  TODO Set up listener service which can
    //    respond to changes to model and affect
    //    the model with those changes.
    //  HOLD on this, I don't know where it should go
  }

  ngOnDestroy () {
    // Remove subscription to free up resources
    this._stateSub.unsubscribe()
  }
}
