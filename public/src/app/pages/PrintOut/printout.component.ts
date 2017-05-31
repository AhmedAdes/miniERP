import {Component, ViewEncapsulation} from '@angular/core';
@Component({
  selector: 'printout',
  encapsulation: ViewEncapsulation.None,
  styles: [],
  template: `<router-outlet></router-outlet>`
})
export class PrintOut {

  constructor() {
  }

  ngOnInit() {
  }
}
