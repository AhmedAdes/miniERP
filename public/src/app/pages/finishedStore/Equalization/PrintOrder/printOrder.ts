import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, Model, ModelColor, FinishedEqualization, FinishedStoreDetail, BatchNo, SalesHeader, CompanyName } from '../../../Models/index';
import { FinEqualizeService, FinDetailService } from '../../../services/index';

@Component({
    selector: 'print-finEqul-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class PrintFinEqulOrderComponent implements OnInit {
    constructor(public srvEqul: FinEqualizeService, private srvDet: FinDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: FinishedEqualization = new FinishedEqualization();
    srchObj: FinishedEqualization = new FinishedEqualization();
    finDetails: FinishedStoreDetail[] = [];
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvEqul.getEqualize(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getFinEqualDetail(id).subscribe(det => {
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