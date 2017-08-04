import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService } from '../../services';
import { Customer } from '../../Models';

interface CustCntryreport {
    Country: string
    CustCount: number
}


@Component({
    selector: 'rpt-custCntry',
    templateUrl: './custByCountry.html',
    styleUrls: ['../../Styles/PrintPortrait.css']
})
export class RptCustCountryComponent implements OnInit {
    constructor(private srv: CustomerService, private loc: Location) { }
    collection: CustCntryreport[] = []
    srchObj: Customer = new Customer()

    pieChartData = [{ data: [], label: '' }];
    pieChartLabels: Array<any> = [];
    public pieChartType:string = 'pie';
    
    ngOnInit() {
        this.srv.getCustomerByCountry().subscribe(ret => {
            this.collection = ret
            this.pieChartData = ret.map(data => { return data.CustCount })//CustCount
            this.pieChartLabels = ret.map(data => { return data.Country })
        })
    }
    
    AfterViewInit() {
        // window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    goBack(){
        this.loc.back();
    }
    printReport(){
        window.print();
    }
}