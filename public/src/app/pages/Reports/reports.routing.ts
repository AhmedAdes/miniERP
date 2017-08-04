import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../services/auth.guard';

import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent,
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent, 
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent, RptSalesSummaryComponent
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
      { path: 'topCust', component: RptTopCustComponent, canActivate: [AuthGuard] },
      { path: 'slsCust', component: RptSalesByCustComponent, canActivate: [AuthGuard] },
      { path: 'slscntry', component: RptSalesByCntryComponent, canActivate: [AuthGuard] },
      { path: 'slsarea', component: RptSalesByAreaComponent, canActivate: [AuthGuard] },
      { path: 'topProd', component: RptTopSalesProdQtyComponent, canActivate: [AuthGuard] },
      { path: 'lstProd', component: RptLeastSalesProdQtyComponent, canActivate: [AuthGuard] },
      { path: 'cmprMonth', component: RptSalesCompareComponent, canActivate: [AuthGuard] },
      { path: 'slsSmry', component: RptSalesSummaryComponent, canActivate: [AuthGuard] },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
