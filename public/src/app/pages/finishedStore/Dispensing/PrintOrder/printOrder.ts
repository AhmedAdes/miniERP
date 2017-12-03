import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, Model, ModelColor, FinishedDispensing, FinishedStoreDetail, BatchNo, SalesHeader, CompanyName } from '../../../../Models';
import { FinDispensingService, FinDetailService } from '../../../../services';
import * as hf from '../../../helper.functions'

@Component({
    selector: 'print-findisp-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})
export class PrintFinDispOrderComponent implements OnInit {
    constructor(public srvDisp: FinDispensingService, private srvDet: FinDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: FinishedDispensing = new FinishedDispensing();
    srchObj: FinishedDispensing = new FinishedDispensing();
    finDetails: FinishedStoreDetail[] = [];
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvDisp.getDispensing(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getFinDispDetail(id).subscribe(det => {
                    this.finDetails = det;
                    this.AfterViewInit()
                }, err => hf.handleError(err));
            }, err => hf.handleError(err))
        }, err => hf.handleError(err))
    }

    AfterViewInit() {
        window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
}
