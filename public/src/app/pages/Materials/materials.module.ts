import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';
import { Ng2PaginationModule } from 'ng2-pagination';

import { routing }       from './materials.routing';
import { Materials } from './materials.component';
import { AccessoryComponent } from './Accessories/accessories.component';
import { ClothComponent } from './cloth/cloth.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing, Ng2PaginationModule
  ],
  declarations: [
    Materials,
    AccessoryComponent,
    ClothComponent
  ]
})
export default class MaterialsModule {}
