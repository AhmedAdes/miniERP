import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, MaterialReturn, MaterialStoreDetail, CompanyName } from '../../../../Models';
import { MatReturnService, MatDetailService } from '../../../../services';

@Component({
    selector: 'print-matRet-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})
export class PrintMatRetComponent implements OnInit {
    constructor(public srvRet: MatReturnService, private srvDet: MatDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: MaterialReturn = new MaterialReturn();
    srchObj: MaterialReturn = new MaterialReturn();
    matDetails: MaterialStoreDetail[] = [];
    Detmodel: MaterialStoreDetail = new MaterialStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvRet.getReturn(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getMatRetDetail(id).subscribe(det => {
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