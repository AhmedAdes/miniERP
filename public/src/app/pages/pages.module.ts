import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageUploadModule } from 'ng2-imageupload';
import { ImageZoomModule } from 'angular2-image-zoom';
import { Ng2CompleterModule } from "ng2-completer";

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
// import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';

import {
  DashboardComponent, UserComponent, ExpansesComponent,
  ChngPassComponent, LoginComponent, LogOutComponent, ProfileComponent
} from './index';
import {
  AuthenticationService, AuthGuard, DashboardService, AccessoryService, BrandService,
  MaterialService, ModelService, ColorService, SizeService, CustomerService, SupplierService,
  ExpansesService, WashTypeService, UserService
} from '../services';

import { PipeModule } from '../pipes/pipes.module';
import { PrintOutModule } from './PrintOut/printout.module'

@NgModule({
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, NgaModule, routing,
    NgxPaginationModule, ImageUploadModule, ImageZoomModule,
    BrowserAnimationsModule, PrintOutModule, Ng2CompleterModule
  ],
  declarations: [
    Pages,
    UserComponent, LoginComponent, LogOutComponent, ChngPassComponent,
    DashboardComponent, ExpansesComponent, ProfileComponent
  ],
  providers: [
    AuthGuard, AuthenticationService, DashboardService,
    AccessoryService, BrandService, MaterialService,
    ModelService, ColorService, SizeService,
    ExpansesService, WashTypeService, UserService
  ]
})
export class PagesModule {
}
