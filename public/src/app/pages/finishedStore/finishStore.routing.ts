import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { FinStoreHomeComponent, StoreBalanceComponent, FinReceivingComponent, BarcodeComponent, FinDispensingComponent, 
  FinEqualizeComponent, FinReturnComponent } from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: FinStoreHomeComponent,
    children: [
      { path: 'balance', component: StoreBalanceComponent, canActivate: [AuthGuard] },
      { path: 'finrec', component: FinReceivingComponent, canActivate: [AuthGuard] },
      { path: 'findisp', component: FinDispensingComponent, canActivate: [AuthGuard] },
      { path: 'finequl', component: FinEqualizeComponent, canActivate: [AuthGuard] },
      { path: 'finret', component: FinReturnComponent, canActivate: [AuthGuard] },
      { path: 'barcode', component: BarcodeComponent, canActivate: [AuthGuard] },
      
    ]
  }
];

export const routing = RouterModule.forChild(routes);
