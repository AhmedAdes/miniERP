import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService, SalesHeaderService } from '../../../services';
import { Customer, SalesHeader, rptSalesByCust } from '../../../Models';
// import { BaseChartDirective } from 'ng2-charts';
import * as hf from '../../helper.functions'

@Component({
    selector: 'rpt-slsCust',
    templateUrl: './salesByCust.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
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
    subHeader: string
    selCust: Customer = new Customer()
    sumTotals: number
    subTotals: number
    sumDiscount: number

    ngOnInit() {
        this.srvCst.getSalesCustomers().subscribe(cst => {
            this.custList = cst
            this.fromDate = hf.handleDate(new Date())
            this.toDate = hf.handleDate(new Date())
        })
    }

    ViewReport() {
        this.srv.getSalesByCustReport(this.custID, this.fromDate, this.toDate).subscribe(ret => {
            this.reportHeader = `Sales By Customer`
            this.subHeader = `From ${this.fromDate} To ${this.toDate}`
            this.collection = ret
            this.selCust = this.custList.filter(x => x.CustID == this.custID)[0]
            this.subTotals = this.collection.reduce((a, b) => a + b.SubTotal, 0)
            this.sumDiscount = this.collection.reduce((a, b) => a + (b.Discount ? b.DiscountPrcnt ? (b.Discount / 100 * b.SubTotal) : b.Discount : 0), 0)
            this.sumTotals = this.subTotals - this.sumDiscount
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
