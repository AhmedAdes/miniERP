import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['../Styles/dashboard.css']
})
export class DashboardComponent implements OnInit {
    constructor(private srv: DashboardService) { }
    FabricCount: number
    AccessoryCount: number
    ModelCount: number
    SalesCount: number
    ngOnInit() { 
        this.srv.getCounts().subscribe(cnt =>{
            this.FabricCount = cnt[0].FabricCount
            this.AccessoryCount = cnt[0].AccessoryCount
            this.ModelCount = cnt[0].ModelCount
            this.SalesCount = cnt[0].SalesCount
        })
    }
}