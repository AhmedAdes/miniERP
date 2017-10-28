import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { ModelService, SalesHeaderService } from '../../../services';
import { Model, SalesHeader, rptSalesByProd } from '../../../Models';
import { BaseChartDirective, Color } from 'ng2-charts';
// import { BaseChartDirective } from 'ng2-charts';

interface MonthChart {
    MonthDate: Date
    TotalAmount: number
}

@Component({
    selector: 'rpt-slsProd',
    templateUrl: './salesByProd.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptSalesByProdComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private srvProd: ModelService, private loc: Location) { }
    @ViewChild(BaseChartDirective) private _chart;

    collection: rptSalesByProd[] = []
    prodList: Model[] = []
    modelIDsList: string[];
    modelID: number
    modelCode: string
    fromDate: string
    toDate: string
    reportHeader: string
    subHeader: string
    selProd: Model = new Model()
    sumTotals: number
    subTotals: number
    sumDiscount: number
    Months: MonthChart[] = []

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
        this.srvProd.getModel().subscribe(cst => {
            this.prodList = cst
            this.modelIDsList = this.prodList.map(m => { return m.ModelCode })
        })
    }

    ViewReport() {
        this.srv.getSalesByProductReport(this.modelID, this.fromDate, this.toDate).subscribe(ret => {
            this.srv.getSalesByProductMonthsReport(this.modelID, this.fromDate, this.toDate).subscribe(chrt => {
                this.reportHeader = `Sales By Customer`
                this.subHeader = `From ${this.fromDate} To ${this.toDate}`
                this.collection = ret
                this.selProd = this.prodList.find(x => x.ModelID == this.modelID)
                this.subTotals = this.collection.reduce((a, b) => a + b.SubTotal, 0)
                this.sumDiscount = this.collection.reduce((a, b) => a + (((b.Discount * b.SubTotal) / 100)), 0)
                this.sumTotals = this.subTotals - this.sumDiscount
                this.Months = chrt
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
    IDSelected(selected) {
        if (selected) {
            this.modelID = this.prodList.find(m => m.ModelCode == selected.title).ModelID
        } else {
            this.modelID = null;
        }
    }
    CodeSelected(selected) {
        if (selected) {
            this.modelCode = this.prodList.find(m => m.ModelID == selected).ModelCode
        } else {
            this.modelCode = null;
        }
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
}