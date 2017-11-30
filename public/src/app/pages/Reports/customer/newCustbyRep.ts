import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService, SalesRepService } from '../../../services';
import { Customer, SalesRep } from '../../../Models'
import * as hf from '../../helper.functions'

@Component({
    selector: 'rpt-newcust',
    templateUrl: './newCustbyRep.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptNewCustbyRepComponent implements OnInit {
    constructor(public serv: CustomerService, private srvRep: SalesRepService, private loc: Location) { }

    collection: Customer[] = [];
    srchObj: Customer = new Customer();
    reportHeader: string = "new Customers Report"
    subHeader: string
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    RepsList: SalesRep[] = [];
    RepID: number
    fromDate: string
    toDate: string

    ngOnInit() {
        this.fromDate = hf.handleDate(new Date())
        this.toDate = hf.handleDate(new Date())
        this.srvRep.getSalesRep().subscribe(ret => this.RepsList = ret)
    }

    ViewReport() {
        this.subHeader = `for ${this.RepsList.find(r => r.SalesRepID == this.RepID).SalesPerson}`
        this.serv.getRepNewCustomer(this.RepID, this.fromDate, this.toDate).subscribe(cols => {
            this.collection = cols
        });
    }

    SortTable(column: string) {
        if (this.orderbyString.indexOf(column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-asc";
            this.orderbyString = '+' + column;
        } else if (this.orderbyString.indexOf('-' + column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-desc";
            this.orderbyString = '-' + column;
        } else {
            this.orderbyClass = 'fa fa-sort';
            this.orderbyString = '';
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
