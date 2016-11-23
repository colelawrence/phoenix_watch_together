
import * as R from '../../shared/read';

import {
  Component, Input, Output, EventEmitter
  // trigger, state, style, transition, animate
} from '@angular/core';

@Component({
  selector: 'ps-lobby-intro',
  template: require('./lobby-intro.component.html'),
  styles: [
    require('./lobby-intro.component.scss')
  ]
})
export class LobbyIntroComponent {
  @Input() lobby: R.Lobby
  @Input() isOpen: boolean = false
  @Output() clickClose = new EventEmitter<void>()

  clickCloseIntro() {
    this.clickClose.emit()
  }
}
