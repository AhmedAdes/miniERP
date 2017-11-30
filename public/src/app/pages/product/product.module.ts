import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { ImageUploadModule } from 'ng2-imageupload';
import { ImageZoomModule } from 'angular2-image-zoom';
import { ColorPickerModule } from 'ngx-color-picker';

import { routing } from './product.routing';
import { Products } from './product.component';
import { BrandComponent, ColorComponent, ModelComponent, ProdInfoComponent, SizeComponent, WashTypeComponent } from './';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    NgaModule,
    routing, ImageUploadModule, ImageZoomModule, ColorPickerModule, NgxPaginationModule
  ],
  declarations: [
    Products, BrandComponent, ColorComponent, ModelComponent,
    ProdInfoComponent, SizeComponent, WashTypeComponent
  ]
})
export class ProductsModule { }
