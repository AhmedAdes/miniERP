import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { QRCodeModule } from 'angular2-qrcode';

import { routing } from './finishStore.routing';
import { FinStoreOutletComponent, StoreBalanceComponent, BarcodeComponent, FinReceivingComponent, FinRecDetailsComponent,
  FinDispensingComponent, FinDispDetailsComponent, FinEqualizeComponent, FinEqualDetailsComponent,
  FinReturnComponent, FinReturnDetailsComponent
} from './index';
import { FinStoreService, FinDetailService, FinReceivingService, FinDispensingService, SalesHeaderService, SalesDetailService,
  FinEqualizeService, FinRejectService, FinReturnService } from '../services/index';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgaModule, routing, NgxPaginationModule, QRCodeModule
  ],
  declarations: [
      FinStoreOutletComponent, StoreBalanceComponent, BarcodeComponent, 
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
export class FinStoreModule { }
