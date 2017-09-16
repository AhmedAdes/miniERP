import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, MaterialReceiving, MaterialStoreDetail, CompanyName } from '../../../../Models';
import { MatReceivingService, MatDetailService } from '../../../../services';

@Component({
    selector: 'print-matRec-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})
export class PrintMatRecComponent implements OnInit {
    constructor(public srvRec: MatReceivingService, private srvDet: MatDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: MaterialReceiving = new MaterialReceiving();
    srchObj: MaterialReceiving = new MaterialReceiving();
    matDetails: MaterialStoreDetail[] = [];
    Detmodel: MaterialStoreDetail = new MaterialStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvRec.getReceiving(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getMatRecDetail(id).subscribe(det => {
                    this.matDetails = det;
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