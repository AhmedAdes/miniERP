import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';

@Component({
    selector: 'print-barcode',
    templateUrl: './barcode.print.html',
    styleUrls: ['./PrintBarcode.css'],
})

export class PrintBarcodeComponent implements OnInit, AfterViewInit {

    barcodeData: any;
    RowsCount: number;
    visBrandName: string;
    visModelName: string;
    visColorCode: string;
    BatchNo: string;    

    constructor(private route: ActivatedRoute, private router: Router) { }
    //{ brand: this.visBrandName, model: this.visModelName, code: this.visColorCode, batch: this.Detmodel.BatchNo, rows: this.RowsCount }
    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.visBrandName = params['brand'];
            this.visModelName = params['model'];
            this.visColorCode = params['code'];
            this.BatchNo = params['batch'];
            this.RowsCount = params['rows'];
        })
        this.barcodeData = "GBG" + "/" + this.visBrandName + "/" + this.visModelName + "/" + this.visColorCode + "/" + this.BatchNo + "/Tel-01099429985"
    }

    createRange(number) {
        var items: number[] = [];
        for (var i = 1; i <= number; i++) {
            items.push(i);
        }
        return items;
    }

    ngAfterViewInit(){
        window.setTimeout(function () { window.print(); }, 500);
        window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
    }
}