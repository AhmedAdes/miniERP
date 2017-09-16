import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService } from '../../../services';
import { Customer } from '../../../Models';
import { BaseChartDirective } from 'ng2-charts';

interface CustAreareport {
    Country: string
    Area: string
    CustCount: number
}

@Component({
    selector: 'rpt-custArea',
    templateUrl: './custByArea.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptCustAreaComponent implements OnInit {
    constructor(private srv: CustomerService, private loc: Location) { }
    @ViewChild(BaseChartDirective) private _chart;

    pieChartData = [{ data: [], label: '' }];
    pieChartLabels: Array<any> = [];
    public pieChartType:string = 'pie';

    collection: CustAreareport[] = []
    
    ngOnInit() {
        this.srv.getCustomerByArea().subscribe(ret => {
            this.collection = ret
            this.pieChartData = ret.map(data => { return data.CustCount })//CustCount
            this.pieChartLabels = ret.map(data => { return data.Area })
            this.forceChartRefresh()
        })
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
    printReport(){
        window.print();
    }
}