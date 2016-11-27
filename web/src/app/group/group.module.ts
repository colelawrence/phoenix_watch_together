import { NgModule }           from '@angular/core';
import { SharedModule }       from '../shared/shared.module';
import { GroupComponent }     from './group.component';
// import { GroupIntroComponent }     from './group-intro/group-intro.component';
import { YoutubeVideoSearchComponent } from './youtube-video-search/youtube-video-search.component';
import { YoutubeAPIService } from './youtube-video-search/youtube-api.service';

import { GroupRoutingModule } from './group-routing.module';
@NgModule({
  imports:      [ SharedModule, GroupRoutingModule ],
  declarations: [ GroupComponent, YoutubeVideoSearchComponent, /*GroupIntroComponent*/ ],
  providers:    [ YoutubeAPIService ]
})
export class GroupModule { }
