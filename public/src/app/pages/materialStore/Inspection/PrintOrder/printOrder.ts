import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { CurrentUser, MaterialInspection, CompanyName } from '../../../../Models';
import { MatInspectionService } from '../../../../services';

@Component({
    selector: 'print-matInsp-order',
    templateUrl: './printOrder.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})
export class PrintMatInspComponent implements OnInit {
    constructor(public srvInsp: MatInspectionService, 
        private route: ActivatedRoute, private router: Router, private loc: Location) { }

    model: MaterialInspection = new MaterialInspection();
    srchObj: MaterialInspection = new MaterialInspection();
    CompanyName = CompanyName

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvInsp.getInspection(id).subscribe(mat => {
                this.model = mat[0];
            })
        })
    }

    AfterViewInit() {
        window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    goBack() {
        this.loc.back();
    }
}