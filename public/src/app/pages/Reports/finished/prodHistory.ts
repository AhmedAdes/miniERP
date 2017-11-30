import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import {
    ModelService, FinDetailService, FinDispensingService, FinReceivingService,
    FinStoreService, SalesDetailService, SalesHeaderService, ColorService
} from '../../../services';
import {
    FinishedStore, FinishedStoreDetail, FinishedDispensing, FinishedReceiving,
    FinishedEqualization, FinishedReturn, FinishedReject,
    SalesDetail, Model, ModelColor
} from '../../../Models';
import { CompleterService, CompleterData, CompleterItem } from 'ng2-completer';
import { Observable } from "rxjs/Observable";
import * as hf from '../../helper.functions'

@Component({
    selector: 'rpt-finHstry',
    templateUrl: './prodHistory.html',
    styleUrls: ['../../../Styles/PrintPortrait.css', '../../../Styles/dashboard.css']
})
export class RptFinHistoryComponent implements OnInit {

    modelsList: Model[];
    colorList: ModelColor[];
    modelIDsList: string[];
    selectedModel: Model;
    selectedColor: ModelColor;
    headerText: string;
    errorMessage: string;
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    showTable: string;
    detform: FormGroup;
    finRecs: any[] = []
    finDisps: any[] = []
    finEqzs: any[] = []
    finRets: any[] = []
    finRejs: any[] = []
    finrecModel = new FinishedDispensing()
    slsOrds: SalesDetail[] = []
    stock: number
    totRec: number
    totDisp: number
    totEqz: number
    totRet: number
    totRej: number
    totSls: number

    constructor(private srvMdl: ModelService, private srvClr: ColorService, private srvDet: FinDetailService,
        private srvFin: FinStoreService, private fb: FormBuilder, private loc: Location) {
        this.detform = fb.group({
            autoModelID: ['', Validators.required],
            ModelID: ['', Validators.required],
            ColorID: ['']
        });
        this.detform.controls['ModelID'].valueChanges.subscribe(value => this.onProdChange(value));
        this.detform.controls['ColorID'].valueChanges.subscribe(value => this.onColorChange(value));
    }

    ngOnInit() {
        this.srvMdl.getModel().subscribe(mods => {
            this.modelsList = mods;
            this.modelIDsList = this.modelsList.map(m => { return m.ModelCode })
            this.showTable = '';
            this.Detmodel = new FinishedStoreDetail();
            this.detform.reset();
        }, err => hf.handleError(err));
    }

    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value) { return }
        this.srvClr.getColor(value).subscribe(clrs => {
            this.colorList = clrs;
            this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
            this.Detmodel.ModelCode = this.selectedModel.ModelCode
        });
    }

    onColorChange(value) {
        if (!value) { return }
        if (this.colorList) {
            this.selectedColor = this.colorList.filter(obj => obj.ColorID == value)[0];
        }
    }
    IDSelected(selected) {
        if (selected) {
            this.Detmodel.ModelID = this.modelsList.filter(m => m.ModelCode == selected.title)[0].ModelID
        } else {
            this.Detmodel.ModelID = null;
        }
    }
    goBack() {
        this.loc.back();
    }
    printReport() {
        window.print();
    }
    viewReport() {
        if (!this.Detmodel.ColorID) {
            this.srvFin.getProdHistory(this.Detmodel.ModelID).subscribe(ret => {
                this.finRecs = ret.finRec
                this.finDisps = ret.finDisp
                this.finEqzs = ret.finEqz
                this.finRets = ret.finRet
                this.finRejs = ret.finRej
                this.slsOrds = ret.sales
                this.stock = ret.stock[0].StockQty
                this.CalculateTotals()
            })
        } else {
            this.srvFin.getProdHistory(this.Detmodel.ModelID, this.Detmodel.ColorID).subscribe(ret => {
                this.finRecs = ret.finRec
                this.finDisps = ret.finDisp
                this.finEqzs = ret.finEqz
                this.finRets = ret.finRet
                this.finRejs = ret.finRej
                this.slsOrds = ret.sales
                this.stock = ret.stock[0].StockQty
                this.CalculateTotals()
            })
        }
    }
    CalculateTotals() {
        this.ZeroAll()
        this.finRecs.forEach(element => { this.totRec += element.Quantity; });
        this.finDisps.forEach(element => { this.totDisp += Math.abs(element.Quantity); });
        this.finEqzs.forEach(element => { this.totEqz += element.Quantity; });
        this.finRets.forEach(element => { this.totRet += element.Quantity; });
        this.finRejs.forEach(element => { this.totRej += element.Quantity; });
        this.slsOrds.forEach(element => { this.totSls += element.Quantity; });
    }
    ZeroAll() {
        this.totRec = 0
        this.totDisp = 0
        this.totEqz = 0
        this.totRet = 0
        this.totRej = 0
        this.totSls = 0
    }
    ShowReceive() {
        this.showTable = 'Receive'
    }
}
