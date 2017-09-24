import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { SalesHeaderService, SalesDetailService, SalesPaymentService } from '../../../../services';
import { SalesHeader, SalesDetail, SalesPayment } from '../../../../Models';

@Component({
    selector: 'print-invoice',
    templateUrl: './invoice.html',
    styleUrls: ['../../../../Styles/PrintPortrait.css']
})

export class InvoicePrintComponent implements OnInit {

    //Make sure you bootstrap your service at startup
    constructor(private srvHead: SalesHeaderService, private srvDet: SalesDetailService,
        private srvPay: SalesPaymentService, private route: ActivatedRoute,
        private router: Router, private loc: Location) { }
    CompanyName = "Global Brands Group"
    header: SalesHeader = new SalesHeader();
    Dispobj: SalesHeader = new SalesHeader();
    Dispdet: SalesDetail = new SalesDetail();
    DispPay: SalesPayment = new SalesPayment();
    SDetails: SalesDetail[] = [];
    SPayments: SalesPayment[] = [];
    subtotal: number;
    subQuant: number;
    sumPay: number;

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            var id = +params['id']
            this.srvHead.getSalesHeader(id).subscribe(mat => {
                this.header = mat[0];
                this.srvDet.getSalesDetail(id).subscribe(det => {
                    this.SDetails = det;
                    this.srvPay.getSalesOrderPayment(id).subscribe(pay => {
                        this.SPayments = pay;
                        this.subtotal = 0;
                        this.subQuant = 0;
                        this.sumPay = 0;
                        this.SDetails.forEach(element => {
                            this.subQuant += element.Quantity;
                            this.subtotal += element.Price * element.Quantity;
                            // this.AfterViewInit()
                        });
                        this.SPayments.forEach(element => {
                            this.sumPay += element.PayAmount
                        })
                    })
                })
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