import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurrentUser, Model, ModelColor, FinishedStoreDetail, BatchNo, SalesHeader, StoreProductTypes } from '../../../../Models';
import { ModelService, ColorService, FinDetailService } from '../../../../services';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../../pipes/validators';

@Component({
    selector: 'fin-disp-detail',
    templateUrl: './details.component.html'
})
export class FinDispDetailsComponent implements OnInit, OnChanges {
    @Input() Details: FinishedStoreDetail[];
    @Input() Detmodel: FinishedStoreDetail;
    @Input() currentUser: CurrentUser;
    @Input() modelsList: Model[];
    colorList: ModelColor[];
    BatchList: BatchNo[];
    modelIDsList: string[];
    colortext: string;
    selectedModel: Model;
    // selectedModelID: number;
    detform: FormGroup;
    EditForm: boolean = false;
    submitted: boolean = false;
    AllStock: any[]
    prodTypes: any[]

    constructor(private srvClr: ColorService, private srvDet: FinDetailService, private fb: FormBuilder) {
        this.detform = fb.group({
            autoModelID: ['', Validators.required],
            ModelID: ['', Validators.required],
            ColorID: ['', Validators.required],
            strProdType: ['', Validators.required],
            BatchNo: ['', Validators.required],
            Stock: [''],
            Quantity: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['ModelID'].valueChanges.subscribe(value => this.onProdChange(value));
        this.detform.controls['ColorID'].valueChanges.subscribe(value => this.onColorChange(value));
        this.detform.controls['strProdType'].valueChanges.subscribe(value => this.onstrProdTypeChange(value));
        this.detform.controls['BatchNo'].valueChanges.subscribe(value => this.onBatchChange(value));
    }

    ngOnInit() {
        this.modelIDsList = this.modelsList.map(m => { return m.ModelCode })
        // this.selectedModelID = this.Detmodel.ModelID;
        // this.selectedColor = this.Detmodel.ColorID;
    }

    ngOnChanges() {
        if (this.Detmodel.ColorID) {
            this.EditForm = true;
            this.detform.controls['autoModelID'].disable()
            this.detform.controls['ModelID'].disable()
            this.detform.controls['ColorID'].disable()
            // this.selectedModelID = this.Detmodel.ModelID;
        }
    }

    prepareDetail() {
        // this.Detmodel.ModelID = this.selectedModelID;
        // this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ColorName = this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
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
        this.detform.controls['autoModelID'].enable()
        this.detform.controls['ModelID'].enable()
        this.detform.controls['ColorID'].enable()
        this.EditForm = false
        this.Detmodel = new FinishedStoreDetail();
        this.colorList = null
        this.BatchList = null
        this.detform.reset();
        this.submitted = false
    }
    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value) { return; }
        this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
        this.srvClr.getColor(value).subscribe(clrs => {
            if (this.Detmodel.ModelID) {
                this.Detmodel.ModelCode = this.selectedModel.ModelCode
                this.colorList = clrs;
                if (this.Detmodel.ColorID && this.EditForm) {
                    this.onColorChange(this.Detmodel.ColorID)
                }
            }
        });
    }
    onColorChange(value) {
        if (!value || !this.colorList) { this.BatchList = null; return; }
        // this.colortext = this.colorList.find(c => c.ColorID == value).ColorName
        this.srvDet.getFinStock(value).subscribe(btc => {
            if (this.Detmodel.ColorID) {
                this.AllStock = btc
                this.prodTypes = btc.map(b => { return { ID: b.StoreTypeID, name: b.StoreType } })
                if (this.Detmodel.StoreTypeID && this.EditForm) {
                    this.onstrProdTypeChange(this.Detmodel.StoreTypeID)
                }
            }
        })
    }
    onstrProdTypeChange(value) {
        if (!value || !this.prodTypes) { return; }
        this.BatchList = this.AllStock.filter(s => s.StoreTypeID == value)
        this.Detmodel.Stock = null
        if (this.Detmodel.BatchNo && this.EditForm) {
            this.onBatchChange(this.Detmodel.BatchNo)
        }
    }
    onBatchChange(value) {
        if (!value || !this.BatchList || value == 'Edit TO Fill This') { return }
        this.Detmodel.Stock = this.BatchList.find(c => c.BatchNo == value).Stock
        this.detform.controls['Quantity'].setValidators([Validators.required, min(0), max(this.Detmodel.Stock)])
        this.detform.controls['Quantity'].updateValueAndValidity()
    }

    IDSelected(selected) {
        if (selected) {
            this.Detmodel.ModelID = this.modelsList.filter(m => m.ModelCode == selected.title)[0].ModelID
        } else {
            this.Detmodel.ModelID = null;
        }
    }
}