import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { SalesHeaderService } from '../../../services';
import { StoreProductTypes, SalesHeader, rptSalesByCust } from '../../../Models';
import * as hf from '../../helper.functions';
// import { BaseChartDirective } from 'ng2-charts';

@Component({
    selector: 'rpt-slsStr',
    templateUrl: './salesByStoreType.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptSalesByStrTypeComponent implements OnInit {
    constructor(private srv: SalesHeaderService, private loc: Location) { }
    // @ViewChild(BaseChartDirective) private _chart;

    collection: rptSalesByCust[] = []
    storeTypes= StoreProductTypes
    TypeID: number
    fromDate: string
    toDate: string
    reportHeader: string
    subHeader: string
    sumTotals: number
    subTotals: number
    sumDiscount: number

    ngOnInit() {
        const today = new Date()
        this.fromDate = hf.handleDate(today)
        this.toDate = hf.handleDate(today)
    }

    ViewReport() {
        this.srv.getSalesByStoreTypeReport(this.TypeID, this.fromDate, this.toDate).subscribe(ret => {
            let stor = this.storeTypes.find(st => st.ID == this.TypeID).name
            this.reportHeader = `Sales By Store Type -${stor}-`
            this.subHeader = `From ${this.fromDate} To ${this.toDate}`
            this.collection = ret
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
