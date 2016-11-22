import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { CommonModule }      from '@angular/common';

/* App Root */
import { AppComponent } from './app.component';

/* Shared Modules */
import { SharedModule } from './shared/shared.module';

/* Feature Modules */
// import { LobbyModule } from './lobby/lobby.module';

import { CoreModule } from './core/core.module';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';


import { DeviceStateService } from './core/device-state.service'
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,

    // Feature Routes
    // LobbyModule,

    // CoreModule defines everything that needs to be imported once,
    // and app-wide singletons such as the DeviceStateService
    CoreModule.forRoot(),

    AppRoutingModule
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    {provide: LocationStrategy, useClass: HashLocationStrategy},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
      public appRef: ApplicationRef,
      private _deviceStateService: DeviceStateService) {}
}
