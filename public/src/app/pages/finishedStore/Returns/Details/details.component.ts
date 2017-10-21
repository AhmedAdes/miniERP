import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurrentUser, Model, ModelColor, FinishedStoreDetail, BatchNo, SalesHeader } from '../../../../Models';
import { ModelService, ColorService, FinDetailService, SalesHeaderService } from '../../../../services';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../../pipes/validators';

@Component({
    selector: 'fin-ret-detail',
    templateUrl: './details.component.html'
})
export class FinReturnDetailsComponent implements OnInit, OnChanges {
    @Input() Details: FinishedStoreDetail[];
    @Input() Detmodel: FinishedStoreDetail;
    @Input() currentUser: CurrentUser;
    @Input() modelsList: any[];
    @Input() SOID: number;
    models: any[]
    colorList: any[];
    BatchList: BatchNo[];
    bno: string
    colortext: string;
    selectedModel: Model;
    selectedModelID: number;
    detform: FormGroup;
    EditForm: boolean = false;
    onReset: boolean
    submitted: boolean = false;
    AllStock: any[]
    prodTypes: any[]

    constructor(private srvClr: ColorService, private srvDet: FinDetailService,
        private srvSO: SalesHeaderService, private fb: FormBuilder) {
        this.detform = fb.group({
            ModelID: ['', Validators.required],
            ColorID: ['', Validators.required],
            BatchNo: ['', Validators.required],
            strProdType: ['', Validators.required],
            Stock: [''],
            Quantity: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['ModelID'].valueChanges.subscribe(value => this.onProdChange(value));
        this.detform.controls['ColorID'].valueChanges.subscribe(value => this.onColorChange(value));
        this.detform.controls['strProdType'].valueChanges.subscribe(value => this.onstrProdTypeChange(value));
        this.detform.controls['BatchNo'].valueChanges.subscribe(value => this.onBatchChange(value));
    }

    ngOnInit() {
        this.determineModelsList()
        this.selectedModelID = this.Detmodel.ModelID;
        this.bno = this.Detmodel.BatchNo
        // this.selectedColor = this.Detmodel.ColorID;
    }
    determineModelsList() {
        let unique = this.modelsList.map(function (obj) { return obj.ModelID; });
        let modelIDs = unique.filter((x, i, a) => a.indexOf(x) == i)
        this.models = modelIDs.map(id => { return { ModelID: id, ModelName: this.modelsList.find(m => m.ModelID == id).ModelName } })
    }
    ngOnChanges() {
        if (this.Detmodel.ColorID && this.Detmodel.Quantity) {
            this.EditForm = true;
            this.detform.controls['ModelID'].disable()
            this.detform.controls['ColorID'].disable()
            this.selectedModelID = this.Detmodel.ModelID;
            this.bno = this.Detmodel.BatchNo
        }
        if (this.modelsList.length || this.SOID) {
            this.determineModelsList()
        }
    }

    prepareDetail() {
        this.Detmodel.ModelID = this.selectedModelID;
        this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ColorName = this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
        this.Detmodel.BatchNo = this.detform.controls['BatchNo'].value
        this.Detmodel.RecordDate = new Date();
        this.Detmodel.StoreType = this.prodTypes.find(st => st.ID == this.Detmodel.StoreTypeID).name
    }
    AddDetail(event) {
        event.preventDefault();
        this.submitted = true
        if (!this.detform.valid) { return }
        this.prepareDetail();
        if (this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID &&
            x.StoreTypeID == this.Detmodel.StoreTypeID && x.BatchNo == this.Detmodel.BatchNo) > -1) {
            var indx = this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID &&
                x.StoreTypeID == this.Detmodel.StoreTypeID && x.BatchNo == this.Detmodel.BatchNo)
            this.Details.fill(this.Detmodel, indx, indx + 1)
        } else {
            this.Details.push(this.Detmodel);
        }
        this.resetTheForm()
    }

    EditDetail() {
        this.submitted = true
        if (!this.detform.valid) { return }
        this.prepareDetail();
        var indx = this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID &&
            x.StoreTypeID == this.Detmodel.StoreTypeID && x.BatchNo == this.Detmodel.BatchNo)
        this.Details.fill(this.Detmodel, indx, indx + 1)
        this.resetTheForm()
    }

    CancelEdit() {
        this.resetTheForm()
    }

    resetTheForm() {
        this.onReset = true
        this.detform.controls['ModelID'].enable()
        this.detform.controls['ColorID'].enable()
        this.colorList = null
        this.BatchList = null
        this.EditForm = false
        this.Detmodel = new FinishedStoreDetail();
        this.detform.reset();
        this.onReset = false
        this.submitted = false
    }
    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value || this.onReset) { return }
        // this.srvSO.getSalesColor(value, this.SOID).subscribe(clrs => {
        this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
        this.colorList = this.modelsList.filter(obj => obj.ModelID == value).map(m => {
            return {
                ColorID: m.ColorID, ColorName: m.ColorName, Quantity: m.Quantity, BatchNo: m.BatchNo, Stock: m.Stock,
                StoreTypeID: m.StoreTypeID, StoreType: m.StoreType
            }
        });
        if (this.Detmodel.ColorID && this.EditForm) {
            this.onColorChange(this.Detmodel.ColorID)
            if (this.Detmodel.StoreTypeID && this.EditForm) {
                this.onstrProdTypeChange(this.Detmodel.StoreTypeID)
                if (this.Detmodel.BatchNo && this.EditForm) {
                    this.onBatchChange(this.Detmodel.BatchNo)
                }
            }
        }
        // });
    }
    onColorChange(value) {
        if ((!value || !this.colorList) || this.onReset) { return }
        this.colortext = this.colorList.find(c => c.ColorID == value).ColorName
        this.prodTypes = this.colorList.filter(c => c.ColorID == value).map(c => { return { ID: c.StoreTypeID, name: c.StoreType, BatchNo: c.BatchNo, Stock: c.Stock } })
        if (this.Detmodel.StoreTypeID && this.EditForm) {
            this.onstrProdTypeChange(this.Detmodel.StoreTypeID)
        }
        // })
    }
    onstrProdTypeChange(value) {
        if (!value || !this.prodTypes) { return; }
        this.BatchList = this.prodTypes.filter(c => c.ID == value).map(c => { return { BatchNo: c.BatchNo, Stock: c.Stock } })
        this.Detmodel.BatchNo = null
        this.Detmodel.Stock = null
        if (this.Detmodel.BatchNo && this.EditForm) {
            this.onBatchChange(this.Detmodel.BatchNo)
        }
    }
    onBatchChange(value) {
        if (!value || !this.BatchList) { return }
        this.Detmodel.Stock = this.BatchList.find(c => c.BatchNo == value).Stock
        // this.detform.controls['Quantity'].setValidators([Validators.required, min(0), max(this.Detmodel.Stock)])
        // this.detform.controls['Quantity'].updateValueAndValidity()
    }
}