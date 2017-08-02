import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';
// import { QRCodeModule } from 'angular2-qrcode';
import { TabsModule } from 'ngx-bootstrap';

import { routing } from './matStore.routing';
import {
  matStore, MatReceivingComponent, MatStoreBalanceComponent, MatInspectionComponent,
  MatDispensingComponent, MatDispDetailsComponent,
  MatEqualizeComponent, MatEqulDetailsComponent,
  MatReturnComponent, MatReturnDetailsComponent
} from './index';
import {
  MaterialService, MatStoreService, MatInspectionService, SupplierService,
  MatDetailService, MatReceivingService, MatDispensingService,
  MatReturnService, MatEqualizeService
} from '../services/index';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgaModule, routing, NgxPaginationModule, //QRCodeModule,
    TabsModule
  ],
  declarations: [
    matStore, MatStoreBalanceComponent, MatInspectionComponent,
    MatReceivingComponent, MatDispensingComponent, MatDispDetailsComponent,
    MatEqualizeComponent, MatEqulDetailsComponent,
    MatReturnComponent, MatReturnDetailsComponent
  ],
  providers: [
    MaterialService, MatStoreService, MatInspectionService, SupplierService,
    MatDetailService, MatReceivingService, MatDispensingService,
    MatReturnService, MatEqualizeService
  ]
})
export class MatStoreModule { }
