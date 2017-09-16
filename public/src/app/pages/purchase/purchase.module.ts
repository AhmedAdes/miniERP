import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { routing } from './purchase.routing';
import {
  Purchase, SupplierComponent
} from './index';
import { SupplierService } from '../../services';

import { PipeModule } from "../../pipes/pipes.module";

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    NgaModule, routing, NgxPaginationModule
  ],
  declarations: [
    Purchase, SupplierComponent
  ],
  providers: [
    SupplierService
  ]
})
export class PurchaseModule { }
