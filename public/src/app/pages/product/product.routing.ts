import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { Products } from './product.component';
import { BrandComponent } from './brand/brand.component';
import { ModelComponent } from './model/model.component';
import { WashTypeComponent } from './washTypes/washType';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Products,
    children: [
      { path: 'brand', component: BrandComponent, canActivate: [AuthGuard] },
      { path: 'wash', component: WashTypeComponent, canActivate: [AuthGuard] },
      { path: 'model', component: ModelComponent, canActivate: [AuthGuard] },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
