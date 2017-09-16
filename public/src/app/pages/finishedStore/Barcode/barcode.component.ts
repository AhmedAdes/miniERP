import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinReceivingService, FinDetailService, ModelService, ColorService } from '../../../services';
import { CurrentUser, FinishedReceiving, FinishedStoreDetail, Model, ModelColor, Barcode } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../pipes/validators';
import { Router } from '@angular/router';

@Component({
    selector: 'fin-barcode',
    templateUrl: './barcode.html',
    styleUrls: ['./PrintBarcode.css'],
    animations: [
        trigger(
            'myAnimation', [
                transition(':enter', [
                    style({ transform: 'translateX(100%)', opacity: 0 }),
                    animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'translateX(0)', 'opacity': 1 }),
                    animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})

export class BarcodeComponent implements OnInit {

    modelsList: Model[];
    colorList: ModelColor[];
    selectedModel: Model;
    selectedColor: ModelColor;
    selectedModelID: number;
    colortext: string;
    headerText: string;
    errorMessage: string;
    Detmodel: Barcode = new Barcode();
    showTable: boolean;
    detform: FormGroup;

    constructor(private srvMdl: ModelService, private srvClr: ColorService,
        private router: Router, private fb: FormBuilder) {
        this.detform = fb.group({
            ModelID: ['', Validators.required],
            ColorID: ['', Validators.required],
            BatchNo: ['', Validators.required],
            Quantity: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['ModelID'].valueChanges.subscribe(value => this.onProdChange(value));
        this.detform.controls['ColorID'].valueChanges.subscribe(value => this.onColorChange(value));
    }

    ngOnInit() {
        this.srvMdl.getModel().subscribe(mods => {
            this.modelsList = mods;
            this.showTable = false;
            this.Detmodel = new Barcode();
            this.detform.reset();
        }, err => this.errorMessage = err.message);
    }

    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value) { return }
        this.srvClr.getColor(value).subscribe(clrs => {
            this.colorList = clrs;
            this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
        });
    }

    onColorChange(value) {
        if (!value) { return }
        if (this.colorList) {
            this.selectedColor = this.colorList.filter(obj => obj.ColorID == value)[0];
        }
    }
    nativewindow: Window
    generateCodes() {
        var RowsCount = Math.ceil(this.Detmodel.Quantity / 5);
        // this.visBrandName = this.selectedModel.BrandName;
        // this.visModelName = this.selectedColor.ModelName;
        // this.visCode = this.selectedModel.ModelCode;
        // this.barcodeData = "GBG" + "/" + this.selectedModel.BrandName + "/" + this.selectedColor.ModelName + "/" + this.selectedColor.ProdColorCode + "/" + this.Detmodel.BatchNo + "/Tel-01099429985"
        // this.showTable = true;
        // this.router.navigate(['printout/barcode/', { brand: this.visBrandName, model: this.visModelName, code: this.visColorCode, batch: this.Detmodel.BatchNo, rows: this.RowsCount }])
        this.router.navigate(['printout/barcode', this.selectedModel.BrandName, this.selectedColor.ModelName, this.selectedModel.ModelCode, this.Detmodel.BatchNo, RowsCount])
        // window.open(`#/printout/barcode/${this.selectedModel.BrandName}/${this.selectedColor.ModelName}/${this.selectedModel.ModelCode}/${this.Detmodel.BatchNo}/${RowsCount}`, '_blank')
    }
}