import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService, SalesHeaderService } from '../../services';
import { Customer, SalesHeader, rptSalesByCust } from '../../Models';
// import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'rpt-slsCust',
    templateUrl: './salesByCust.html',
    styleUrls: ['../../Styles/PrintPortrait.css']
})
export class RptSalesByCustComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private srvCst: CustomerService, private loc: Location) { }
    // @ViewChild(BaseChartDirective) private _chart;

    collection: rptSalesByCust[] = []
    custList: Customer[] = []
    custID: number
    fromDate: string
    toDate: string
    reportHeader: string
    selCust: Customer = new Customer()
    sumTotals: number

    ngOnInit() {
        this.srvCst.getSalesCustomers().subscribe(cst => {
            this.custList = cst
        })
    }

    ViewReport() {
        this.srv.getSalesByCustReport(this.custID, this.fromDate, this.toDate).subscribe(ret => {
            this.reportHeader = `Sales By Customer From ${this.fromDate} To ${this.toDate}`
            this.collection = ret
            this.selCust = this.custList.filter(x => x.CustID == this.custID)[0]
            var Total = this.collection.reduce((a, b) => a + b.SubTotal, 0)
            var disCount = this.collection.reduce((a, b) => a + ((b.Discount * b.SubTotal) / 100), 0)
            this.sumTotals = Total - disCount
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