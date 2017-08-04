import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { SalesHeaderService } from '../../services';
// import { rptTopCustomers } from '../../Models';
import { BaseChartDirective } from 'ng2-charts';

interface SlsProdQtyreport {
    ModelCode: string
    ModelName: string
    Quantity: number
    Amount: number
}
@Component({
    selector: 'rpt-topProdQty',
    templateUrl: './TopSalesProdQty.html',
    styleUrls: ['../../Styles/PrintPortrait.css']
})
export class RptTopSalesProdQtyComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private loc: Location) { }
    @ViewChild(BaseChartDirective) private _chart;

    pieChartData = [{ data: [], label: '' }];
    pieChartLabels: Array<any> = [];
    public pieChartType: string = 'pie';

    collection: SlsProdQtyreport[] = []
    fromDate: string
    toDate: string
    reportHeader: string
    filterBy: string = 'Quantity'

    ngOnInit() {
        this.ViewReport()
    }

    ViewReport() {
        this.srv.getTopSellingProd(this.filterBy, this.fromDate, this.toDate).subscribe(ret => {
            this.collection = ret
            this.pieChartData = ret.map(data => { return data.Quantity })
            this.pieChartLabels = ret.map(data => { return data.ModelName })
            this.reportHeader = `Top 10 Selling Products From ${this.fromDate} To ${this.toDate}`
            this.forceChartRefresh()
        })
    }
    onFilterChange(newobj, FType) {
        if (newobj.target.checked === true) {
            this.filterBy = FType
        }
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