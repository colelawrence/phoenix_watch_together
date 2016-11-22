import { Component, Input } from '@angular/core';

import * as R from '../../shared/read';


@Component({
  selector: 'ps-interest-block',
  template: require('./interest-block.component.html'),
  styles: [
    require('./interest-block.component.scss')
  ]
})
export class InterestBlockComponent {
  @Input() interest: R.Video
  @Input() isActive: boolean
}
