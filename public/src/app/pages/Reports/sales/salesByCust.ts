import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
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

    constructor(private srv: SalesHeaderService, private srvCst: CustomerService,
        private route: ActivatedRoute, private loc: Location) { }

    ngOnInit() {
        this.srvCst.getSalesCustomers().subscribe(cst => {
            this.custList = cst
            this.route.params.subscribe((params: Params) => {
                this.custID = params[0] || undefined
                this.fromDate = params[1] || hf.handleDate(new Date())
                this.toDate = params[2] || hf.handleDate(new Date())
                if (this.custID) this.ViewReport()
            })
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
