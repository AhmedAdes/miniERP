import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '../../services/auth.guard';

import { Materials } from './materials.component';
import { AccessoryComponent } from './Accessories/accessories.component';
import { ClothComponent } from './cloth/cloth.component';

// noinspection TypeScriptValidateTypes
const routes: Routes = [
  {
    path: '',
    component: Materials,
    children: [
      { path: 'Accessories', component: AccessoryComponent, canActivate: [AuthGuard] },
      { path: 'fabrics', component: ClothComponent, canActivate: [AuthGuard] }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
