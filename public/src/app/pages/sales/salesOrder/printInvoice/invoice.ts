import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { SalesHeaderService, SalesDetailService } from '../../../services/index';
import { SalesHeader, SalesDetail } from '../../../Models/index';

@Component({
    selector: 'print-invoice',
    templateUrl: './invoice.html',
    styleUrls: ['../../../Styles/PrintPortrait.css']
})

export class InvoicePrintComponent implements OnInit {

    //Make sure you bootstrap your service at startup
    constructor(private srvHead: SalesHeaderService, private srvDet: SalesDetailService,
        private route: ActivatedRoute, private router: Router, private loc: Location) { }
    CompanyName = "Global Brands Group"
    header: SalesHeader = new SalesHeader();
    Dispobj: SalesHeader = new SalesHeader();
    Dispdet: SalesDetail = new SalesDetail();
    SDetails: SalesDetail[] = [];
    subtotal: number;

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvHead.getSalesHeader(id).subscribe(mat => {
                this.header = mat[0];
                this.srvDet.getSalesDetail(id).subscribe(det => {
                    this.SDetails = det;
                    this.subtotal = 0;
                    this.SDetails.forEach(element => {
                        this.subtotal += element.Price * element.Quantity;
                        // this.AfterViewInit()
                    });
                })
            })
        })
    }
    AfterViewInit() {
        window.setTimeout(function () { window.print(); }, 500);
        // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
    goBack(){
        this.loc.back();
    }
}