import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { AuthenticationService, FinStoreService } from '../../../services';
import { FinishedStore, CurrentUser, CompanyName } from '../../../Models';
import { Location } from '@angular/common'
import * as hf from '../../helper.functions'

@Component({
    selector: 'rpt-FinBlnc-Date',
    templateUrl: './balanceByDate.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptFinStoreBlncDateComponent implements OnInit {
    constructor(public serv: FinStoreService, private auth: AuthenticationService, private loc: Location) { }

    srchObj: FinishedStore = new FinishedStore();
    collection: FinishedStore[] = [];
    VisibleBalance: FinishedStore[] = [];
    CompanyName = CompanyName
    fromDate: string
    today: Date = new Date()

    ngOnInit() {
        this.fromDate = hf.handleDate(this.today)
        this.ViewReport()
    }
    ViewReport() {
        this.serv.getStoreBalanceinDate(this.fromDate).subscribe(cols => {
            this.collection = cols
            this.ZeroBalance(true)
        });
    }
    ZeroBalance(active) {
        if (active) {
            this.VisibleBalance = this.collection.filter(c => c.Quantity > 0)
        } else {
            this.VisibleBalance = this.collection
        }
    }
    AfterViewInit() {
        // window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    goBack() {
        this.loc.back();
    }
    printReport() {
        window.print();
    }
}