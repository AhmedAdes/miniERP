import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { SalesHeaderService } from '../../services';
import { rptCompareSales } from '../../Models';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'rpt-slscmpr',
    templateUrl: './cmprlastMnth.html',
    styleUrls: ['../../Styles/PrintPortrait.css']
})
export class RptSalesCompareComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private loc: Location) { }
    // @ViewChild(BaseChartDirective) private _chart;

    // barChartData = [{ data: [], label: '' }];
    // barChartLabels: Array<any> = [];
    public barChartType: string = 'bar';

    collection: rptCompareSales[] = []
    firstDate: string
    secondDate: string
    reportHeader: string 

    ngOnInit() {
        
    }

    ViewReport() {
        var date1 = new Date(this.firstDate)
        var date2 = new Date(this.secondDate)
        this.srv.getCompareSales(date1.getMonth()+1, date1.getFullYear(), date2.getMonth()+1, date2.getFullYear()).subscribe(ret => {
            this.collection = ret
            // this.barChartData = ret.map(data => { return data.Amount })//CustCount
            // this.barChartLabels = ret.map(data => { return data.Area })
            this.reportHeader= `Sales Comparison Between ${this.firstDate} And ${this.secondDate}`
            this.forceChartRefresh()
        })
    }

    AfterViewInit() {
        // window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    forceChartRefresh() {
        setTimeout(() => {
            // this._chart.refresh();
        }, 10);
    }
    goBack() {
        this.loc.back();
    }
    printReport() {
        window.print();
    }
}