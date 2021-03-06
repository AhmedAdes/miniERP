import { Component } from '@angular/core';
import { Routes } from '@angular/router';

import { BaMenuService } from '../theme';
import { PAGES_MENU } from './pages.menu';

@Component({
  selector: 'pages',
  template: `
    <ba-sidebar class="no-print"></ba-sidebar>
    <ba-page-top class="no-print"></ba-page-top>
    <div class="al-main">
      <div class="al-content">
        <ba-content-top class="no-print"></ba-content-top>
        <router-outlet></router-outlet>
      </div>
    </div>    
    <ba-back-top position="200"></ba-back-top>
    `,
    styleUrls: ['./pages.component.scss']
})
export class Pages {
  constructor(private _menuService: BaMenuService,) {
  }

  ngOnInit() {
    this._menuService.updateMenuByRoutes(<Routes>PAGES_MENU);
  }
}
