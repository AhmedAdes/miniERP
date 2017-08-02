import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { NgxPaginationModule } from 'ngx-pagination';

import { routing }       from './materials.routing';
import { Materials } from './materials.component';
import { AccessoryComponent } from './Accessories/accessories.component';
import { ClothComponent } from './cloth/cloth.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing, NgxPaginationModule
  ],
  declarations: [
    Materials,
    AccessoryComponent,
    ClothComponent
  ]
})
export class MaterialsModule {}
