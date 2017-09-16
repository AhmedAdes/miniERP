import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './reports.routing';
import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent,
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
  RptSalesSummaryComponent, RptSalesIncomeTrackerComponent
} from './index';
// import { ChartsModule } from './charts.module'
import { ChartsModule } from 'ng2-charts';
import { CustomerService, SalesHeaderService } from '../services/index';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing, NgxPaginationModule, ChartsModule
  ],
  declarations: [
    ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent,
    RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
    RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
    RptSalesSummaryComponent, RptSalesIncomeTrackerComponent
  ],
  providers: [
    CustomerService, SalesHeaderService
  ],
})
export class ReportsModule {
}