import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, MaterialEqualization, MaterialStoreDetail, CompanyName } from '../../../Models/index';
import { MatEqualizeService, MatDetailService } from '../../../services/index';

@Component({
    selector: 'print-matEqul-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class PrintMatEqulComponent implements OnInit {
    constructor(public srvEqul: MatEqualizeService, private srvDet: MatDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: MaterialEqualization = new MaterialEqualization();
    srchObj: MaterialEqualization = new MaterialEqualization();
    matDetails: MaterialStoreDetail[] = [];
    Detmodel: MaterialStoreDetail = new MaterialStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvEqul.getEqualize(id).subscribe(mat => {
                this.model = mat[0];
                this.srvDet.getMatEqualDetail(id).subscribe(det => {
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