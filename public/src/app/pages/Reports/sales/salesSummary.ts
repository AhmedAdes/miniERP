import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { SalesHeaderService } from '../../../services';
// import { rptSalesByCust } from '../../../Models';
import { BaseChartDirective, Color } from 'ng2-charts';


interface MonthChart {
    MonthDate: Date
    TotalAmount: number
}

interface slsSummary {
    TotalAmount: number
    TotalOrders: number
    TotalCustomers: number
    TotalProducts: number
}

@Component({
    selector: 'rpt-slsSmry',
    templateUrl: './salesSummary.html',
    styles: [".rowHeader: {font-weight: bold!important; background-color: palegreen!important}"],
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptSalesSummaryComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private loc: Location) { }
    @ViewChild(BaseChartDirective) private _chart;

    collection: MonthChart[] = []
    sumry: slsSummary = { TotalAmount: 0, TotalOrders: 0, TotalCustomers: 0, TotalProducts: 0 }
    fromDate: string
    toDate: string
    reportHeader: string

    chartData = [{ data: [], label: '' }];
    lineChartLabels: Array<any> = [];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
    lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: true
    };
    colorsEmpty: Array<Color> = []

    ngOnInit() {

    }

    ViewReport() {
        this.srv.getSalesSummary(this.fromDate, this.toDate).subscribe(ret => {
            this.reportHeader = `Sales Summary From ${this.fromDate} To ${this.toDate}`
            this.sumry = ret[0]
            this.srv.getSalesSummaryChart(this.fromDate, this.toDate).subscribe(chrt => {
                this.collection = chrt
                this.chartData = [{
                    data: chrt.map(da => { return da.TotalAmount == null ? 0 : da.TotalAmount }),
                    label: 'Total Amount'
                }]
                this.lineChartLabels = chrt.map(data => { return data.MonthDate.split('T')[0] })
                this.forceChartRefresh()
            })
        })
    }

    forceChartRefresh() {
        setTimeout(() => {
            this._chart.refresh();
        }, 10);
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