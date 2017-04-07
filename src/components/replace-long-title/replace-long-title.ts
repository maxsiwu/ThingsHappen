import { Directive,ElementRef } from '@angular/core';

/*
  Generated class for the ReplaceLongTitle directive.

  See https://angular.io/docs/ts/latest/api/core/index/DirectiveMetadata-class.html
  for more info on Angular 2 Directives.
*/
@Directive({
  selector: '[replace-long-title]', // Attribute selector
  // host:{
  //   '(click)':"getElementWidth()"
  // }
})
export class ReplaceLongTitle {
  eleWidth;

  constructor(public el:ElementRef) {
      console.log('Hello ReplaceLongTitle Directive');
  }

  getElementWidth(){
      this.eleWidth = this.el.nativeElement.offsetWidth;
      console.log('hello', this.eleWidth);
  }
}
