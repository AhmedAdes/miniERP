import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgaModule } from '../../theme/nga.module';
import { Ng2CompleterModule } from "ng2-completer";
import { ChartsModule } from 'ng2-charts';

import { routing } from './reports.routing';
import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent,
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
  RptSalesSummaryComponent, RptSalesIncomeTrackerComponent,
  RptFinHistoryComponent, RptFinRecPeriodComponent, RptFinDispPeriodComponent,
  RptFinEqzPeriodComponent, RptFinRetPeriodComponent, RptFinEmptyStockComponent, RptAllCustomersComponent,
  RptFinStoreBlncDateComponent, RptSalesByProdComponent, RptSalesByStrTypeComponent
} from './index';
import {
  CustomerService, SalesHeaderService, SalesDetailService, FinStoreService, FinDetailService, FinReceivingService, FinDispensingService,
  ModelService, ColorService
} from '../../services';
import { PipeModule } from '../../pipes/pipes.module'

let cust_Rpts = [RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent, RptAllCustomersComponent]
let sls_Rpts = [
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
  RptSalesSummaryComponent, RptSalesIncomeTrackerComponent, RptSalesByProdComponent, RptSalesByStrTypeComponent
]
let fin_Rpts = [RptFinHistoryComponent, RptFinRecPeriodComponent, RptFinDispPeriodComponent,
  RptFinEqzPeriodComponent, RptFinRetPeriodComponent, RptFinEmptyStockComponent, RptFinStoreBlncDateComponent]
@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing,
    PipeModule, NgxPaginationModule, ChartsModule, Ng2CompleterModule
  ],
  declarations: [
    ReportsComponent, ReportHomeComponent, cust_Rpts, sls_Rpts, fin_Rpts
  ],
  providers: [
    CustomerService, SalesHeaderService, SalesDetailService, FinStoreService, FinDetailService, FinReceivingService, FinDispensingService,
    ModelService, ColorService
  ],
})
export class ReportsModule {
}
