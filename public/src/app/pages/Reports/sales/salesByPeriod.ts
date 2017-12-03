import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { ModelService, SalesHeaderService } from '../../../services';
import { SalesHeader, rptSalesPeriod } from '../../../Models';
import { BaseChartDirective, Color } from 'ng2-charts';
import * as hf from '../../helper.functions'

@Component({
    selector: 'rpt-slsGroup',
    templateUrl: './salesByPeriod.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptSalesByPeriodComponent implements OnInit {
    @ViewChild(BaseChartDirective) private _chart;

    collection: rptSalesPeriod[] = []
    groupByList = ['No-Group', 'Product', 'Customer', 'Store', 'Country'];
    selGroup: string
    fromDate: string
    toDate: string
    reportHeader: string
    subHeader: string
    sumTotals: number
    sumQty: number
    sumSales: number
    subTotals: number
    sumDiscount: number
    showLoading: boolean

    chartData = [{ data: [], label: '' }];
    lineChartLabels: Array<any> = [];
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';
    lineChartOptions: any = {
        responsive: true,
        maintainAspectRatio: true
    };
    colorsEmpty: Array<Color> = []

    constructor(private srv: SalesHeaderService, private srvProd: ModelService, private route: ActivatedRoute,
        private router: Router, private loc: Location) { }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.selGroup = params[0] || 'No-Group'
            this.fromDate = params[1] || hf.handleDate(new Date())
            this.toDate = params[2] || hf.handleDate(new Date())

            this.ViewReport()
        })
    }

    ViewReport() {
        this.showLoading = true
        this.srv.getSalesByPeriod(this.selGroup, this.fromDate, this.toDate).subscribe(ret => {
            // this.srv.getSalesByProductMonthsReport(this.modelID, this.fromDate, this.toDate).subscribe(chrt => {
            this.collection = ret
            this.reportHeader = `Sales By Period ${this.selGroup !== 'No-Group' ?  'Grouped By ' + this.selGroup : ''}`
            this.subHeader = `From ${this.fromDate} To ${this.toDate}`
            this.sumQty = this.collection.reduce((a, b) => a + b.Quantity, 0)
            this.sumSales = this.collection.reduce((a, b) => a + b.SalesCount, 0)
            this.subTotals = this.collection.reduce((a, b) => a + b.SubTotal, 0)
            this.sumDiscount = this.collection.reduce((a, b) => a + b.TOTDiscount, 0)
            this.sumTotals = this.subTotals - this.sumDiscount
            // this.Months = chrt
            // this.chartData = [{
            //     data: chrt.map(da => { return da.TotalAmount == null ? 0 : da.TotalAmount }),
            //     label: 'Total Amount'
            // }]
            // this.lineChartLabels = chrt.map(data => { return data.MonthDate.split('T')[0] })
            // this.forceChartRefresh()
            // })
        }, err => hf.handleError(err), () => this.showLoading = false)
    }
    forceChartRefresh() {
        setTimeout(() => {
            this._chart.refresh();
        }, 10);
    }
    // header.Discount ? header.DiscountPrcnt ? (subtotal * header.Discount / 100) : header.Discount : 0
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
    viewCustDetails(id) {
        this.router.navigate(['/home/reports/slsCust', [id, this.fromDate, this.toDate]])
    }
    viewProdDetails(id) {
        this.router.navigate(['/home/reports/slsProd', [id, this.fromDate, this.toDate]])
    }
}
