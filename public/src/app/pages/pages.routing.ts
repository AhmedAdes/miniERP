import { Routes, RouterModule } from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

import { AuthGuard } from '../services/auth.guard';

import {
  DashboardComponent, UserComponent, ProfileComponent, ChngPassComponent
} from './index';
import { ReportHomeComponent } from './Reports/reportHome/rptHome.component'

export const routes: Routes = [
  {
    path: 'home',
    component: Pages,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
      { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
      { path: 'pass', component: ChngPassComponent, canActivate: [AuthGuard] },
      { path: 'materials', loadChildren: 'app/pages/Materials/materials.module#MaterialsModule' },
      { path: 'prod', loadChildren: 'app/pages/product/product.module#ProductsModule' },
      { path: 'sales', loadChildren: 'app/pages/sales/sales.module#SalesModule' },
      { path: 'finish', loadChildren: 'app/pages/finishedStore/finishStore.module#FinStoreModule' },
      { path: 'purchase', loadChildren: 'app/pages/purchase/purchase.module#PurchaseModule' },
      { path: 'matstore', loadChildren: 'app/pages/materialStore/matStore.module#MatStoreModule' },
      { path: 'reports', loadChildren: 'app/pages/Reports/reports.module#ReportsModule' },
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
