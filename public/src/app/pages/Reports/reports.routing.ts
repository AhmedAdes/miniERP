import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../services/auth.guard';

import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent
} from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent,
    children: [
      { path: 'home', component: ReportHomeComponent, canActivate: [AuthGuard] },
      { path: 'custcntry', component: RptCustCountryComponent, canActivate: [AuthGuard] },
      { path: 'custarea', component: RptCustAreaComponent, canActivate: [AuthGuard] },
      //   { path: 'finDisp/:id', component: PrintFinDispOrderComponent, canActivate: [AuthGuard] },
      //   { path: 'finRec/:id', component: PrintFinRecOrderComponent, canActivate: [AuthGuard] },
      //   { path: 'finEqul/:id', component: PrintFinEqulOrderComponent, canActivate: [AuthGuard] },
      //   { path: 'finRet/:id', component: PrintFinRtrnOrderComponent, canActivate: [AuthGuard] },
      //   { path: 'matDisp/:id', component: PrintMatDispComponent, canActivate: [AuthGuard] },
      //   { path: 'matRec/:id', component: PrintMatRecComponent, canActivate: [AuthGuard] },
      //   { path: 'matEqul/:id', component: PrintMatEqulComponent, canActivate: [AuthGuard] },
      //   { path: 'matRet/:id', component: PrintMatRetComponent, canActivate: [AuthGuard] }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
