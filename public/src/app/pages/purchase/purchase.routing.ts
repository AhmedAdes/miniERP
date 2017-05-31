import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../services/auth.guard';

import { Purchase,SupplierComponent } from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Purchase,
    children: [
      { path: 'supplier', component: SupplierComponent, canActivate: [AuthGuard] }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
