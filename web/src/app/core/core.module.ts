import {
  ModuleWithProviders, NgModule,
  Optional, SkipSelf }  from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpModule }   from '@angular/http';
import { FormsModule }  from '@angular/forms';

import { DeviceStateService } from './device-state.service';
import { SocketService }      from './phoenix/socket.service';
import {
  AppWriter, GroupWriter,
} from '../core/writers';
@NgModule({
  imports:      [ CommonModule, HttpModule, FormsModule ],
  declarations: [],
  // exports:      [ TitleComponent ],
  providers:    [
    DeviceStateService,
    SocketService,

		AppWriter,
    GroupWriter,
  ]
})
export class CoreModule {
  // From https://angular.io/docs/ts/latest/cookbook/ngmodule-faq.html#!#what-is-the-_forroot_-method-
  // The forRoot static method is a convention that makes it easy for developers to
  // configure the module's provider(s).
  static forRoot(/*config: UserServiceConfig*/): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        // {provide: UserServiceConfig, useValue: config }
      ]
    };
  }

  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

}
