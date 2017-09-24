import { Routes, RouterModule } from '@angular/router';
import { PrintOut } from './printout.component';

import { AuthGuard } from '../../services/auth.guard';

import {
  PrintBarcodeComponent, InvoicePrintComponent, PrintFinDispOrderComponent, 
  PrintFinRecOrderComponent, PrintFinEqulOrderComponent, PrintFinRtrnOrderComponent,
  PrintMatDispComponent, PrintMatRecComponent, PrintMatEqulComponent, PrintMatRetComponent,
  PrintMatInspComponent, PrintFinStoreBlncComponent
} from './index';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: 'printout',
    component: PrintOut,
    children: [
      { path: 'barcode/:brand/:model/:code/:batch/:rows', component: PrintBarcodeComponent, canActivate: [AuthGuard] },
      { path: 'invoice/:id', component: InvoicePrintComponent, canActivate: [AuthGuard] },
      { path: 'finDisp/:id', component: PrintFinDispOrderComponent, canActivate: [AuthGuard] },
      { path: 'finRec/:id', component: PrintFinRecOrderComponent, canActivate: [AuthGuard] },
      { path: 'finEqul/:id', component: PrintFinEqulOrderComponent, canActivate: [AuthGuard] },
      { path: 'finRet/:id', component: PrintFinRtrnOrderComponent, canActivate: [AuthGuard] },
      { path: 'finBlnc', component: PrintFinStoreBlncComponent, canActivate: [AuthGuard] },
      { path: 'matDisp/:id', component: PrintMatDispComponent, canActivate: [AuthGuard] },
      { path: 'matRec/:id', component: PrintMatRecComponent, canActivate: [AuthGuard] },
      { path: 'matEqul/:id', component: PrintMatEqulComponent, canActivate: [AuthGuard] },
      { path: 'matRet/:id', component: PrintMatRetComponent, canActivate: [AuthGuard] },
      { path: 'matInsp/:id', component: PrintMatInspComponent, canActivate: [AuthGuard] }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
