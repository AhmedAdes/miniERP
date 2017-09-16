import { NgModule }      from '@angular/core';
 import { ArrayFilterPipe, ArrayOrderByPipe }          from './index';

 @NgModule({
     imports:        [],
     declarations:   [ArrayFilterPipe, ArrayOrderByPipe],
     exports:        [ArrayFilterPipe, ArrayOrderByPipe],
 })

 export class PipeModule {

 static forRoot() {
      return {
          ngModule: PipeModule,
          providers: [],
      };
  }
}