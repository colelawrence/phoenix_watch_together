
import {
  Component, Input, Output, EventEmitter, OnDestroy
  // trigger, state, style, transition, animate
} from '@angular/core';

import {Subscription} from 'rxjs'

import { YoutubeAPIService, ResultVideoItem } from './youtube-api.service'

export { ResultVideoItem }

@Component({
  selector: 'wt-youtube-video-search',
  template: require('./youtube-video-search.component.html'),
  styles: [
    require('./youtube-video-search.component.scss')
  ]
})
export class YoutubeVideoSearchComponent implements OnDestroy {
  @Input() isOpen: boolean = false
  @Input() apiKey: string
  @Output() clickClose = new EventEmitter<void>()
  @Output() addVideo = new EventEmitter<ResultVideoItem>()

  searchResults: ResultVideoItem[]
  searchInput: string
  _searchSub: Subscription

	constructor(private _ytApiService: YoutubeAPIService) {
    this._searchSub =
    _ytApiService.state.subscribe((videos: ResultVideoItem[]) => {			
      this.searchResults = videos
    })
  }

  ngOnDestroy() {
    this._searchSub.unsubscribe()
  }

  clickCloseSearch() {
    this.clickClose.emit()
  }

  clickAddVideo(video: ResultVideoItem) {
    this.addVideo.emit(video)
    this.clickClose.emit()
  }

	getVideoStatusIndicator(videoId) {
		return "*"
  }

	clickSearch() {
    console.log("Searching Youtube:", this.searchInput)
		
    this._ytApiService.search({
      key: this.apiKey,
      query: this.searchInput,
      maxResults: 5
    })
  }
}
