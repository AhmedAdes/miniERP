import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { matStore, MatStoreBalanceComponent, MatInspectionComponent, MatReceivingComponent, 
  MatDispensingComponent, MatEqualizeComponent, MatReturnComponent } from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: matStore,
    children: [
      { path: 'balance', component: MatStoreBalanceComponent, canActivate: [AuthGuard] },
      { path: 'matrec', component: MatReceivingComponent, canActivate: [AuthGuard] },
      { path: 'matinsp', component: MatInspectionComponent, canActivate: [AuthGuard] },
      { path: 'matdisp', component: MatDispensingComponent, canActivate: [AuthGuard] },
      { path: 'matequl', component: MatEqualizeComponent, canActivate: [AuthGuard] },
      { path: 'matret', component: MatReturnComponent, canActivate: [AuthGuard] },
      
    ]
  }
];

export const routing = RouterModule.forChild(routes);

