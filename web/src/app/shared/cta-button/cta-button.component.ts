import { Component, Input } from '@angular/core'

@Component({
  selector: 'ps-cta-button',
  template: `{{ text }}`,
  styles: [
    require('./cta-button.component.scss')
    ]
})
export class CtaButtonComponent {
  @Input() text: string
}
