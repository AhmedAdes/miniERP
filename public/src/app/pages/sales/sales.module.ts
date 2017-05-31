import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2PaginationModule } from 'ng2-pagination';

import { routing } from './sales.routing';
import {
	Sales, CustomerComponent, SalesOrderComponent, SalesHeaderComponent,
	SalesRepComponent, SalesDetailComponent, SalesPaymentComponent,
	PaymentComponent, CommissionComponent
} from './index';
import { CustomerService, SalesDetailService, SalesHeaderService, SalesPaymentService, SalesRepService } from '../services/index';

import { PipeModule } from '../pipes/pipes.module';

@NgModule({
	imports: [
		CommonModule, FormsModule, ReactiveFormsModule,
		NgaModule, routing, Ng2PaginationModule
	],
	declarations: [
		Sales, SalesOrderComponent, SalesHeaderComponent,
		CustomerComponent, SalesRepComponent, SalesDetailComponent,
		SalesPaymentComponent, PaymentComponent, CommissionComponent
	],
	providers: [
		CustomerService, SalesDetailService, SalesHeaderService,
		SalesPaymentService, SalesRepService
	]
})
export default class SalesModule { }
