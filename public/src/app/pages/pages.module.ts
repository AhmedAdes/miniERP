import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from 'ng2-imageupload';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxPaginationModule } from 'ngx-pagination';
// import { QRCodeModule } from 'ng2-qrcode';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { ReportsModule } from './Reports/reports.module';

import {
  BrandComponent, DashboardComponent, ModelComponent, UserComponent, ExpansesComponent,
  ColorComponent, SizeComponent, ProdInfoComponent, LoginComponent, LogOutComponent
} from './index';
import {
  AuthenticationService, AuthGuard, DashboardService, AccessoryService, BrandService,
  MaterialService, ModelService, ColorService, SizeService, CustomerService, SupplierService,
  ExpansesService
} from './services/index';

import { PipeModule } from './pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing,
    ImageUploadModule, ColorPickerModule, NgxPaginationModule, //NgxQRCodeModule,
    ReportsModule, BrowserAnimationsModule
  ],
  declarations: [
    Pages,
    UserComponent, BrandComponent, LoginComponent, LogOutComponent,
    DashboardComponent, ModelComponent,
    ColorComponent, SizeComponent, ProdInfoComponent, ExpansesComponent
  ],
  providers: [
    AuthGuard, AuthenticationService, DashboardService,
    AccessoryService, BrandService,
    MaterialService, ModelService, ColorService,
    SizeService, ExpansesService
  ]
})
export class PagesModule {
}
