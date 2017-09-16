import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './printout.routing';
import { PrintOut } from './printout.component';
import {
  PrintBarcodeComponent, InvoicePrintComponent, PrintFinDispOrderComponent,
  PrintFinRecOrderComponent, PrintFinEqulOrderComponent, PrintFinRtrnOrderComponent,
  PrintMatDispComponent, PrintMatRecComponent, PrintMatEqulComponent, PrintMatRetComponent
} from './index';
import {
  SalesHeaderService, SalesDetailService,
  FinDetailService, FinReceivingService, FinDispensingService, FinEqualizeService, FinReturnService,
  MatDetailService, MatReceivingService, MatDispensingService, MatEqualizeService, MatReturnService
} from '../services/index';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing,
    NgxQRCodeModule
  ],
  declarations: [
    PrintOut, PrintBarcodeComponent, InvoicePrintComponent, PrintFinDispOrderComponent,
    PrintFinRecOrderComponent, PrintFinEqulOrderComponent, PrintFinRtrnOrderComponent,
    PrintMatDispComponent, PrintMatRecComponent, PrintMatEqulComponent, PrintMatRetComponent
  ],
  providers: [
    SalesHeaderService, SalesDetailService,
    FinDetailService, FinReceivingService, FinDispensingService, FinEqualizeService, FinReturnService,
    MatDetailService, MatReceivingService, MatDispensingService, MatEqualizeService, MatReturnService
  ],
})
export class PrintOutModule {
}