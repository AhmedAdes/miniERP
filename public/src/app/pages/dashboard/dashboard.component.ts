import { Component, OnInit } from '@angular/core';
import { DashboardService, SalesHeaderService } from '../../services';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['../../Styles/dashboard.css']
})
export class DashboardComponent implements OnInit {
    constructor(private srv: DashboardService, private srvsales: SalesHeaderService) { }
    FabricCount: number
    AccessoryCount: number
    ModelCount: number
    SalesCount: number

    UnpaidA
    UnpaidQ
    OverDueA
    OverDueQ
    PaidA
    PaidQ

    
    ngOnInit() { 
        this.srv.getCounts().subscribe(cnt =>{
            this.FabricCount = cnt[0].FabricCount
            this.AccessoryCount = cnt[0].AccessoryCount
            this.ModelCount = cnt[0].ModelCount
            this.SalesCount = cnt[0].SalesCount
            
            this.srvsales.getIncomeTracker().subscribe(ret => {
                this.UnpaidA = ret.Unpaid[0].UnpaidAmount
                this.UnpaidQ = ret.Unpaid[0].OpenInvoices
                this.OverDueA = ret.OverDue[0].OverDueAmount
                this.OverDueQ = ret.OverDue[0].OverDueInvoices
                this.PaidA = ret.Paid[0].PaidAmount
                this.PaidQ = ret.Paid[0].BilledInvoices
            })
        })
    }
}