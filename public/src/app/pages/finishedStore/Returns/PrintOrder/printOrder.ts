import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, Model, ModelColor, FinishedReturn, FinishedStoreDetail, BatchNo, SalesHeader, CompanyName } from '../../../../Models';
import { FinReturnService, FinDetailService } from '../../../../services';

@Component({
    selector: 'print-finret-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})
export class PrintFinRtrnOrderComponent implements OnInit {
    constructor(public srvRet: FinReturnService, private srvDet: FinDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: FinishedReturn = new FinishedReturn();
    srchObj: FinishedReturn = new FinishedReturn();
    finDetails: FinishedStoreDetail[] = [];
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvRet.getReturn(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getFinRetDetail(id).subscribe(det => {
                    this.finDetails = det;
                    this.AfterViewInit()
                });
            })
        })
    }

    AfterViewInit() {
        window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
}