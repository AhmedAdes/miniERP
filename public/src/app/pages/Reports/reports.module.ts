import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './reports.routing';
import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent
} from './index';
// import { ChartsModule } from './charts.module'
import { ChartsModule } from 'ng2-charts';
import { CustomerService } from '../services/index';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing, NgxPaginationModule, ChartsModule
  ],
  declarations: [
    ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent
  ],
  providers: [
    CustomerService
  ],
})
export class ReportsModule {
}