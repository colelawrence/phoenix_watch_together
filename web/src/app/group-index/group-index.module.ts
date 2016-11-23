import { NgModule }           from '@angular/core';
import { SharedModule }       from '../shared/shared.module';
import { GroupIndexComponent }     from './group-index.component';
// import { GroupIntroComponent }     from './group-intro/group-intro.component';

import { GroupRoutingModule } from './group-index-routing.module';
@NgModule({
  imports:      [ SharedModule, GroupRoutingModule ],
  declarations: [ GroupIndexComponent, /*GroupIntroComponent*/ ],
  providers:    []
})
export class GroupIndexModule { }
