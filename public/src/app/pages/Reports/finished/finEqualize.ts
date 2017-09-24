import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { FinStoreService } from '../../../services';
import { FinishedEqualization } from '../../../Models'

@Component({
    selector: 'rpt-finEqz',
    templateUrl: './finEqualize.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptFinEqzPeriodComponent implements OnInit {
    constructor(private srvFin: FinStoreService, private loc: Location) { }
    
    collection: any[] = []
    srchObj = new FinishedEqualization()
    fromDate: string
    toDate: string
    reportHeader: string
    subHeader: string

    ngOnInit() {

    }

    ViewReport() {
        this.srvFin.getEqualizePeriod(this.fromDate, this.toDate).subscribe(ret => {
            this.collection = ret
            // this.barChartData = ret.map(data => { return data.Amount })
            // this.barChartLabels = ret.map(data => { return data.Country })
            this.reportHeader = `Finished Store Equalization Details`
            this.subHeader = `From ${this.fromDate} To ${this.toDate}`
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