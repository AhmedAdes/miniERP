import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { LoginComponent, LogOutComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
    { path: 'logout', component: LogOutComponent },
  
  // otherwise redirect to home
  // { path: '**', redirectTo: 'login' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
