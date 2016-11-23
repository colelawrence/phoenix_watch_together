import { NgModule }           from '@angular/core';
import { SharedModule }       from '../shared/shared.module';
import { GroupComponent }     from './group.component';
// import { GroupIntroComponent }     from './group-intro/group-intro.component';

import { GroupRoutingModule } from './group-routing.module';
@NgModule({
  imports:      [ SharedModule, GroupRoutingModule ],
  declarations: [ GroupComponent, /*GroupIntroComponent*/ ],
  providers:    []
})
export class GroupModule { }
