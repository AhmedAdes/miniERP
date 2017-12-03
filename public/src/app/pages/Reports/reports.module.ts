import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgaModule } from '../../theme/nga.module';
import { Ng2CompleterModule } from "ng2-completer";
import { ChartsModule } from 'ng2-charts';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';

import { routing } from './reports.routing';
import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent,
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
  RptSalesSummaryComponent, RptSalesIncomeTrackerComponent,
  RptFinHistoryComponent, RptFinRecPeriodComponent, RptFinDispPeriodComponent,
  RptFinEqzPeriodComponent, RptFinRetPeriodComponent, RptFinEmptyStockComponent,
  RptAllCustomersComponent, RptFinStoreBlncDateComponent, RptSalesByProdComponent,
  RptSalesByStrTypeComponent, RptSalesByPeriodComponent, RptNewCustbyRepComponent
} from './index';
import {
  CustomerService, SalesHeaderService, SalesDetailService, FinStoreService, FinDetailService, FinReceivingService, FinDispensingService,
  ModelService, ColorService, SalesRepService
} from '../../services';
import { PipeModule } from '../../pipes/pipes.module'

let cust_Rpts = [RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent, RptAllCustomersComponent]
let sls_Rpts = [
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
  RptSalesSummaryComponent, RptSalesIncomeTrackerComponent, RptSalesByProdComponent,
  RptSalesByStrTypeComponent, RptNewCustbyRepComponent
]
let fin_Rpts = [RptFinHistoryComponent, RptFinRecPeriodComponent, RptFinDispPeriodComponent,
  RptFinEqzPeriodComponent, RptFinRetPeriodComponent, RptFinEmptyStockComponent, RptFinStoreBlncDateComponent,
  RptSalesByPeriodComponent
]
let spinConfig = {
  animationType: ANIMATION_TYPES.threeBounce,
  backdropBackgroundColour: 'rgba(0,0,0,0.1)', 
  backdropBorderRadius: '10px',
  fullScreenBackdrop: false,
  primaryColour: 'lightseagreen', 
  secondaryColour: 'lightseagreen', 
  tertiaryColour: 'lightseagreen'
}
@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing,
    PipeModule, NgxPaginationModule, ChartsModule, Ng2CompleterModule,
    LoadingModule.forRoot(spinConfig)
  ],
  declarations: [
    ReportsComponent, ReportHomeComponent, cust_Rpts, sls_Rpts, fin_Rpts
  ],
  providers: [
    CustomerService, SalesHeaderService, SalesDetailService, FinStoreService, FinDetailService, FinReceivingService, FinDispensingService,
    ModelService, ColorService, SalesRepService
  ],
})
export class ReportsModule {
}
