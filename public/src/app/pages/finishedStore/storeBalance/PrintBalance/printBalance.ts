import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { AuthenticationService, FinStoreService } from '../../../../services';
import { FinishedStore, CurrentUser, CompanyName } from '../../../../Models';
import { Location } from '@angular/common'

@Component({
    selector: 'print-fin-blnc',
    templateUrl: './printBalance.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})
export class PrintFinStoreBlncComponent implements OnInit {
    constructor(public serv: FinStoreService, private auth: AuthenticationService, private loc: Location) { }

    srchObj: FinishedStore = new FinishedStore();
    collection: FinishedStore[] = [];
    CompanyName = CompanyName
    today: Date = new Date()

    ngOnInit() {
        this.ViewReport()
    }
    ViewReport(){
        this.serv.getStoreZeroBalance().subscribe(cols => this.collection = cols);
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