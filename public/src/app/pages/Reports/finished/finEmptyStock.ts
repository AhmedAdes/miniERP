import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { FinStoreService } from '../../../services';
import { FinishedStoreDetail } from '../../../Models'

@Component({
    selector: 'rpt-finEmpty',
    templateUrl: './finEmptyStock.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptFinEmptyStockComponent implements OnInit {
    constructor(private srvFin: FinStoreService, private loc: Location) { }
    
    collection: any[] = []
    srchObj = new FinishedStoreDetail()
    reportHeader: string
    subHeader: string

    ngOnInit() {

    }

    ViewReport() {
        this.srvFin.getEmptyStock().subscribe(ret => {
            this.collection = ret
            // this.barChartData = ret.map(data => { return data.Amount })
            // this.barChartLabels = ret.map(data => { return data.Country })
            this.reportHeader = `Empty Stock Products Report`
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