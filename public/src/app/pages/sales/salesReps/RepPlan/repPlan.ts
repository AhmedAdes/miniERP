import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService, SalesRepService } from '../../../../services';
import { SalesRep, SalesRepTarget, CurrentUser } from '../../../../Models';
import * as hf from '../../../helper.functions'

@Component({
    selector: 'sales-rep-target',
    templateUrl: './repPlan.html',
})
export class SalesRepTargetComponent implements OnInit {

    collection: SalesRepTarget[] = [];
    srchObj: SalesRepTarget = new SalesRepTarget()
    @Input() salesRep: number
    @Output() backHit = new EventEmitter()
    SalesPerson: string
    TargetYear: number
    TargetTotal: number
    headerText: string;
    errorMessage: string;

    constructor(public serv: SalesRepService, private auth: AuthenticationService) { }

    ngOnInit() {
        this.TargetYear = new Date().getFullYear()
        this.YearChanged()
    }
    YearChanged() {
        this.serv.getSalesRepPlan(this.salesRep, this.TargetYear).subscribe(cols => {
            this.collection = cols
            this.SalesPerson = this.collection[0].SalesPerson
            this.CalcTotal()
        })
    }
    HandleForm(event) {
        event.preventDefault();
        this.serv.insertSalesPlan(this.salesRep, this.collection).subscribe(ret => {
            if (ret.error) {
                hf.handleError(ret.error)
            } else if (ret.affected > 0) {
                this.backHit.emit()
            }
        }, err => hf.handleError(err));
    }
    TableBack() {
        this.backHit.emit()
    }
    CalcTotal() {
        this.TargetTotal = 0
        this.collection.forEach(element => {
            this.TargetTotal += element.MonthQty
        });
    }

}
