import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2PaginationModule } from 'ng2-pagination';

import { routing } from './purchase.routing';
import {
  Purchase, SupplierComponent
} from './index';
import { SupplierService } from '../services/index';

import { PipeModule } from "../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgaModule, routing, Ng2PaginationModule
  ],
  declarations: [
    Purchase, SupplierComponent
  ],
  providers: [
    SupplierService
  ]
})
export default class PurchaseModule { }
