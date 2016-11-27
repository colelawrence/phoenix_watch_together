
import {
  Component, Input, Output, EventEmitter
  // trigger, state, style, transition, animate
} from '@angular/core';

@Component({
  selector: 'wt-youtube-video-search',
  template: require('./youtube-video-search.component.html'),
  styles: [
    require('./youtube-video-search.component.scss')
  ]
})
export class YoutubeVideoSearchComponent {
  @Input() isOpen: boolean = false
  @Input() apiKey: string
  @Output() clickClose = new EventEmitter<void>()
  @Output() addVideo = new EventEmitter<string>()

  searchResults: any[]
  searchInput: string

  clickCloseSearch() {
    this.clickClose.emit()
  }

  clickAddVideo(video) {
    this.addVideo.emit(video)
  }

	clickSearch() {
    console.log("Searching Youtube:", this.searchInput)

  }
}
