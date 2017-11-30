import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { SalesHeaderService } from '../../../services';
// import { SalesHeader } from '../../../Models';
import { BaseChartDirective } from 'ng2-charts';
import * as hf from '../../helper.functions'

interface SlsAreareport {
    Area: string
    Quantity: number
    Amount: number
}

@Component({
    selector: 'rpt-slsArea',
    templateUrl: './salesByArea.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptSalesByAreaComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private loc: Location) { }
    @ViewChild(BaseChartDirective) private _chart;

    barChartData = [{ data: [], label: '' }];
    barChartLabels: Array<any> = [];
    public barChartType: string = 'bar';

    collection: SlsAreareport[] = []
    cntryList: any[] = []
    cntry: string
    fromDate: string
    toDate: string
    reportHeader: string 
    subHeader: string

    ngOnInit() {
        this.fromDate = hf.handleDate(new Date())
        this.toDate = hf.handleDate(new Date())
        this.srv.getSellingCountries().subscribe(cnt => this.cntryList = cnt)
    }

    ViewReport() {
        this.srv.getSalesByAreaReport(this.cntry, this.fromDate, this.toDate).subscribe(ret => {
            this.collection = ret
            this.barChartData = ret.map(data => { return data.Amount })//CustCount
            this.barChartLabels = ret.map(data => { return data.Area })
            this.reportHeader= `Sales by Areas`
            this.subHeader = `From ${this.fromDate} To ${this.toDate}`
            this.forceChartRefresh()
        })
    }

    AfterViewInit() {
        // window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    forceChartRefresh() {
        setTimeout(() => {
            this._chart.refresh();
        }, 10);
    }
    goBack() {
        this.loc.back();
    }
    printReport() {
        window.print();
    }
}