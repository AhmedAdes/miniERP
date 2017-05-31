import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, MaterialDispensing, MaterialStoreDetail, CompanyName } from '../../../Models/index';
import { MatDispensingService, MatDetailService } from '../../../services/index';

@Component({
    selector: 'print-matDisp-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class PrintMatDispOrderComponent implements OnInit {
    constructor(public srvDisp: MatDispensingService, private srvDet: MatDetailService,
        private route: ActivatedRoute, private router: Router) { }

    model: MaterialDispensing = new MaterialDispensing();
    srchObj: MaterialDispensing = new MaterialDispensing();
    matDetails: MaterialStoreDetail[] = [];
    Detmodel: MaterialStoreDetail = new MaterialStoreDetail();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvDisp.getDispensing(id).subscribe(mat => {
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