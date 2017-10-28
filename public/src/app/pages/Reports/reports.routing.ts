import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import {
  ReportsComponent, ReportHomeComponent, RptCustCountryComponent, RptCustAreaComponent, RptTopCustComponent,
  RptSalesByCustComponent, RptSalesByCntryComponent, RptSalesByAreaComponent,
  RptLeastSalesProdQtyComponent, RptTopSalesProdQtyComponent, RptSalesCompareComponent,
  RptSalesSummaryComponent, RptSalesIncomeTrackerComponent, RptFinHistoryComponent,
  RptFinRecPeriodComponent, RptFinDispPeriodComponent, RptFinEqzPeriodComponent,
  RptFinRetPeriodComponent, RptFinEmptyStockComponent, RptAllCustomersComponent,
  RptFinStoreBlncDateComponent, RptSalesByProdComponent
} from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  // { path: '', redirectTo: '/reports/home', pathMatch: 'full' },
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: 'home', component: ReportHomeComponent, canActivate: [AuthGuard] },
      { path: 'custcntry', component: RptCustCountryComponent, canActivate: [AuthGuard] },
      { path: 'custarea', component: RptCustAreaComponent, canActivate: [AuthGuard] },
      { path: 'topCust', component: RptTopCustComponent, canActivate: [AuthGuard] },
      { path: 'allCust', component: RptAllCustomersComponent, canActivate: [AuthGuard] },
      { path: 'slsCust', component: RptSalesByCustComponent, canActivate: [AuthGuard] },
      { path: 'slsProd', component: RptSalesByProdComponent, canActivate: [AuthGuard] },
      { path: 'slscntry', component: RptSalesByCntryComponent, canActivate: [AuthGuard] },
      { path: 'slsarea', component: RptSalesByAreaComponent, canActivate: [AuthGuard] },
      { path: 'topProd', component: RptTopSalesProdQtyComponent, canActivate: [AuthGuard] },
      { path: 'lstProd', component: RptLeastSalesProdQtyComponent, canActivate: [AuthGuard] },
      { path: 'cmprMonth', component: RptSalesCompareComponent, canActivate: [AuthGuard] },
      { path: 'slsSmry', component: RptSalesSummaryComponent, canActivate: [AuthGuard] },
      { path: 'slsincm', component: RptSalesIncomeTrackerComponent, canActivate: [AuthGuard] },
      { path: 'finHst', component: RptFinHistoryComponent, canActivate: [AuthGuard] },
      { path: 'rptfinRec', component: RptFinRecPeriodComponent, canActivate: [AuthGuard] },
      { path: 'rptfinDisp', component: RptFinDispPeriodComponent, canActivate: [AuthGuard] },
      { path: 'rptfinEqul', component: RptFinEqzPeriodComponent, canActivate: [AuthGuard] },
      { path: 'rptfinRet', component: RptFinRetPeriodComponent, canActivate: [AuthGuard] },
      { path: 'rptfinEmpty', component: RptFinEmptyStockComponent, canActivate: [AuthGuard] },
      { path: 'blncDate', component: RptFinStoreBlncDateComponent, canActivate: [AuthGuard] },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
