import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2PaginationModule } from 'ng2-pagination';
import { QRCodeModule } from 'angular2-qrcode';

import { routing } from './finishStore.routing';
import { finStore, StoreBalanceComponent, FinReceivingComponent, FinRecDetailsComponent, BarcodeComponent,
  FinDispensingComponent, FinDispDetailsComponent, FinEqualizeComponent, FinEqualDetailsComponent,
  FinReturnComponent, FinReturnDetailsComponent
} from './index';
import { FinStoreService, FinDetailService, FinReceivingService, FinDispensingService, SalesHeaderService, SalesDetailService,
  FinEqualizeService, FinRejectService, FinReturnService } from '../services/index';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgaModule, routing, Ng2PaginationModule, QRCodeModule
  ],
  declarations: [
      finStore, StoreBalanceComponent, BarcodeComponent, 
      FinReceivingComponent, FinRecDetailsComponent, 
      FinDispensingComponent, FinDispDetailsComponent, 
      FinEqualizeComponent, FinEqualDetailsComponent,
      FinReturnComponent, FinReturnDetailsComponent
  ],
  providers: [
      FinStoreService, FinDetailService, FinReceivingService, FinDispensingService, SalesHeaderService, SalesDetailService,
      FinEqualizeService, FinRejectService, FinReturnService
  ]
})
export default class FinStoreModule { }
