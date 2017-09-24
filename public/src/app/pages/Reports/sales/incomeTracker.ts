import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { SalesHeaderService } from '../../../services';
import { SalesPayment } from '../../../Models';
import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'rpt-incom',
    templateUrl: './incomeTracker.html',
    styleUrls: ['../../../Styles/PrintPortrait.css', '../../../Styles/dashboard.css']
})
export class RptSalesIncomeTrackerComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private loc: Location) { }
    // @ViewChild(BaseChartDirective) private _chart;

    // barChartData = [{ data: [], label: '' }];
    // barChartLabels: Array<any> = [];
    // public barChartType: string = 'bar';

    collection: SalesPayment[] = []
    srchObj: SalesPayment = new SalesPayment()
    firstDate: string
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    secondDate: string
    reportHeader: string
    UnpaidA
    UnpaidQ
    OverDueA
    OverDueQ
    PaidA
    PaidQ

    ngOnInit() {
        this.ViewReport()
    }

    ViewReport() {
        this.srv.getIncomeTracker().subscribe(ret => {
            this.UnpaidA = ret.Unpaid[0].UnpaidAmount
            this.UnpaidQ = ret.Unpaid[0].OpenInvoices
            this.OverDueA = ret.OverDue[0].OverDueAmount
            this.OverDueQ = ret.OverDue[0].OverDueInvoices
            this.PaidA = ret.Paid[0].PaidAmount
            this.PaidQ = ret.Paid[0].BilledInvoices
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

    ShowPaid() {
        this.srv.getPaidInvoices().subscribe(cols => {
            this.collection = cols
            this.reportHeader = "Paid Invoices in last 30 Days"
        })
    }
    ShowOverDue() {
        this.srv.getOverdueInvoices().subscribe(cols => {
            this.collection = cols
            this.reportHeader = "Overdue Invoices"
        })
    }
    ShowUnPaid() {
        this.srv.getUnpaidInvoices().subscribe(cols => {
            this.collection = cols
            this.reportHeader = "Unpaid Invoices"
        })
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
}