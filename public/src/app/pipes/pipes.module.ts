import { NgModule }      from '@angular/core';
 import { ArrayFilterPipe, ArrayOrderByPipe, AbsoluteValuePipe }          from './index';

 @NgModule({
     imports:        [],
     declarations:   [ArrayFilterPipe, ArrayOrderByPipe, AbsoluteValuePipe],
     exports:        [ArrayFilterPipe, ArrayOrderByPipe, AbsoluteValuePipe],
 })

 export class PipeModule {

 static forRoot() {
      return {
          ngModule: PipeModule,
          providers: [],
      };
  }
}