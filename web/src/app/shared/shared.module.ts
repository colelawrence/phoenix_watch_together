import { NgModule }            from '@angular/core';
import { CommonModule }        from '@angular/common';
import { FormsModule }         from '@angular/forms';

import { InterestBlockComponent } from './interest-block/interest-block.component';
import { CtaButtonComponent } from './cta-button/cta-button.component'

// Components that live in multiple places around the app go here.
// Examples may include: ps-button, ps-input, ps-carousel, etc.

// See https://angular.io/docs/ts/latest/guide/ngmodule.html#!#cleanup

// from Angular 2 ngmodule guide:
// Do not specify app-wide singleton providers in a shared module.
// A lazy loaded module that imports that shared module will make
// its own copy of the service.

// import { AwesomePipe }         from './awesome.pipe';
// import { HighlightDirective }  from './highlight.directive';
@NgModule({
  imports:      [ CommonModule ],
  declarations: [ InterestBlockComponent, CtaButtonComponent ],
  exports:      [ InterestBlockComponent,
                  CommonModule, FormsModule,
                  CtaButtonComponent ]
})
export class SharedModule { }
