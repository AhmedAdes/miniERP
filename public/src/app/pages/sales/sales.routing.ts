import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { Sales, CustomerComponent, SalesOrderComponent, SalesRepComponent, 
  PaymentComponent, CommissionComponent } from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Sales,
    children: [
      { path: 'customer', component: CustomerComponent, canActivate: [AuthGuard] },
      { path: 'order', component: SalesOrderComponent, canActivate:[AuthGuard] },
      { path: 'salesrep', component: SalesRepComponent, canActivate:[AuthGuard] },
      { path: 'payment', component: PaymentComponent, canActivate:[AuthGuard] },
      { path: 'commission', component: CommissionComponent, canActivate:[AuthGuard] }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
