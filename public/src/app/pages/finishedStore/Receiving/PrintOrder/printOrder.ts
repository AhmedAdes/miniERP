import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, Model, ModelColor, FinishedReceiving, FinishedStoreDetail, BatchNo, SalesHeader, CompanyName } from '../../../Models/index';
import { FinReceivingService, FinDetailService } from '../../../services/index';

@Component({
    selector: 'print-finrec-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class PrintFinRecOrderComponent implements OnInit {
    constructor(public srvRec: FinReceivingService, private srvDet: FinDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: FinishedReceiving = new FinishedReceiving();
    srchObj: FinishedReceiving = new FinishedReceiving();
    finDetails: FinishedStoreDetail[] = [];
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvRec.getReceiving(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getFinRecDetail(id).subscribe(det => {
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