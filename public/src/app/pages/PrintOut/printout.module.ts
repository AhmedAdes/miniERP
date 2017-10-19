import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QRCodeModule } from 'angular2-qrcode-generator';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './printout.routing';
import { PrintOut } from './printout.component';
import {
  PrintBarcodeComponent, InvoicePrintComponent, PrintFinDispOrderComponent,
  PrintFinRecOrderComponent, PrintFinEqulOrderComponent, PrintFinRtrnOrderComponent,
  PrintMatDispComponent, PrintMatRecComponent, PrintMatEqulComponent, PrintMatRetComponent,
  PrintMatInspComponent, PrintFinStoreBlncComponent
} from './index';
import {
  SalesHeaderService, SalesDetailService, SalesPaymentService,
  FinDetailService, FinReceivingService, FinDispensingService, FinEqualizeService, FinReturnService,
  MatDetailService, MatReceivingService, MatDispensingService, MatEqualizeService, MatReturnService,
  MatInspectionService, FinStoreService
} from '../../services';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing, QRCodeModule
  ],
  declarations: [
    PrintOut, PrintBarcodeComponent, InvoicePrintComponent, PrintFinDispOrderComponent,
    PrintFinRecOrderComponent, PrintFinEqulOrderComponent, PrintFinRtrnOrderComponent,
    PrintMatDispComponent, PrintMatRecComponent, PrintMatEqulComponent, PrintMatRetComponent,
    PrintMatInspComponent, PrintFinStoreBlncComponent
  ],
  providers: [
    SalesHeaderService, SalesDetailService, SalesPaymentService,
    FinDetailService, FinReceivingService, FinDispensingService, FinEqualizeService, FinReturnService,
    MatDetailService, MatReceivingService, MatDispensingService, MatEqualizeService, MatReturnService,
    MatInspectionService, FinStoreService
  ],
})
export class PrintOutModule {
}
