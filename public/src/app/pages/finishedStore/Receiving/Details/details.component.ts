import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurrentUser, Model, ModelColor, FinishedStoreDetail, StoreProductTypes } from '../../../../Models';
import { ModelService, ColorService, FinDetailService } from '../../../../services';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../../pipes/validators';

@Component({
    selector: 'fin-rec-detail',
    templateUrl: './details.component.html'
})
export class FinRecDetailsComponent implements OnInit, OnChanges {
    @Input() Details: FinishedStoreDetail[];
    @Input() Detmodel: FinishedStoreDetail;
    @Input() currentUser: CurrentUser;
    @Input() modelsList: Model[];
    @Input() BatchNo: string;
    colorList: ModelColor[];
    modelIDsList: string[];
    colortext: string;
    selectedModel: Model;
    // selectedModelID: number;
    detform: FormGroup;
    EditForm: boolean = false;
    submitted: boolean = false;
    prodTypes = StoreProductTypes

    constructor(private srvClr: ColorService, private srvDet: FinDetailService, private fb: FormBuilder) {
        this.detform = fb.group({
            autoModelID: ['', Validators.required],
            modelID: ['', Validators.required],
            clrID: ['', Validators.required],
            strProdType: ['', Validators.required],
            Qty: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['modelID'].valueChanges.subscribe(value => this.onProdChange(value));
        // this.ctrlColorID.valueChanges.subscribe(value => this.onColorChange(value));
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
            this.detform.controls['modelID'].disable()
            this.detform.controls['clrID'].disable()
            // this.selectedModelID = this.Detmodel.ModelID;
        }
    }

    prepareDetail() {
        // this.Detmodel.ModelID = this.selectedModelID;
        this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ColorName = this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
        this.Detmodel.RecordDate = new Date();
        this.Detmodel.BatchNo = this.BatchNo;
        this.Detmodel.StoreType = this.prodTypes.find(st => st.ID == this.Detmodel.StoreTypeID).name
    }
    AddDetail(event) {
        event.preventDefault();
        this.submitted = true
        if (!this.detform.valid) { return }
        this.prepareDetail();
        if (this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID) > -1) {
            var indx = this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID)
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
        var indx = this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID)
        this.Details.fill(this.Detmodel, indx, indx + 1)
        this.resetTheForm()
    }

    CancelEdit() {
        this.resetTheForm()
    }

    resetTheForm() {
        this.detform.controls['autoModelID'].enable()
        this.detform.controls['modelID'].enable()
        this.detform.controls['clrID'].enable()
        this.EditForm = false
        this.Detmodel.ModelID = null
        this.Detmodel = new FinishedStoreDetail();
        this.detform.reset();
        this.submitted = false
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

    IDSelected(selected) {
        if (selected) {
            this.Detmodel.ModelID = this.modelsList.filter(m => m.ModelCode == selected.title)[0].ModelID
        } else {
            this.Detmodel.ModelID = null;
        }
    }
}