import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService } from '../../../services';
import { rptTopCustomers } from '../../../Models';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'rpt-topCust',
    templateUrl: './topCust.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptTopCustComponent implements OnInit {
    constructor(private srv: CustomerService, private loc: Location) { }
    @ViewChild(BaseChartDirective) private _chart;

    barChartData = [{ data: [], label: '' }];
    barChartLabels: Array<any> = [];
    public pieChartType: string = 'bar';

    collection: rptTopCustomers[] = []
    fromDate: string
    toDate: string
    reportHeader: string 

    ngOnInit() {

    }

    ViewReport() {
        this.srv.getTopCustomers(this.fromDate, this.toDate).subscribe(ret => {
            this.collection = ret
            this.barChartData = ret.map(data => { return data.GT })//CustCount
            this.barChartLabels = ret.map(data => { return data.CustName })
            this.reportHeader= `Top 5 Customers for Sales From ${this.fromDate} To ${this.toDate}`
        })
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