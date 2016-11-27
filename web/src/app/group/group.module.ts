import { NgModule }           from '@angular/core';
import { SharedModule }       from '../shared/shared.module';
import { GroupComponent }     from './group.component';
// import { GroupIntroComponent }     from './group-intro/group-intro.component';
import { YoutubeVideoSearchComponent } from './youtube-video-search/youtube-video-search.component';

import { GroupRoutingModule } from './group-routing.module';
@NgModule({
  imports:      [ SharedModule, GroupRoutingModule ],
  declarations: [ GroupComponent, YoutubeVideoSearchComponent, /*GroupIntroComponent*/ ],
  providers:    []
})
export class GroupModule { }
