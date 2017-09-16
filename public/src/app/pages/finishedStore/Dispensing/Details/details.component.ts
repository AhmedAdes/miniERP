import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurrentUser, Model, ModelColor, FinishedStoreDetail, BatchNo, SalesHeader } from '../../../../Models';
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
    @Input() BatchNo: string;
    colorList: ModelColor[];
    BatchList: BatchNo[];
    colortext: string;
    selectedModel: Model;
    selectedModelID: number;
    detform: FormGroup;
    EditForm: boolean = false;

    constructor(private srvClr: ColorService, private srvDet: FinDetailService, private fb: FormBuilder) {
        this.detform = fb.group({
            ModelID: ['', Validators.required],
            ColorID: ['', Validators.required],
            BatchNo: ['', Validators.required],
            Stock: [''],
            Quantity: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['ModelID'].valueChanges.subscribe(value => this.onProdChange(value));
        this.detform.controls['ColorID'].valueChanges.subscribe(value => this.onColorChange(value));
        this.detform.controls['BatchNo'].valueChanges.subscribe(value => this.onBatchChange(value));
    }

    ngOnInit() {
        this.selectedModelID = this.Detmodel.ModelID;
        // this.selectedColor = this.Detmodel.ColorID;
    }

    ngOnChanges() {
        if (this.Detmodel.ColorID) {
            this.EditForm = true;
            this.detform.controls['ModelID'].disable()
            this.detform.controls['ColorID'].disable()
            this.selectedModelID = this.Detmodel.ModelID;
        }
    }

    prepareDetail() {
        // this.Detmodel.ModelID = this.selectedModelID;
        // this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ModelName = this.modelsList.filter(obj => obj.ModelID == this.Detmodel.ModelID)[0].ModelName
        this.Detmodel.ColorName = this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
        this.Detmodel.RecordDate = new Date();
    }
    AddDetail(event) {
        event.preventDefault();
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
        this.prepareDetail();
        var indx = this.Details.findIndex(x => x.ModelID == this.Detmodel.ModelID && x.ColorID == this.Detmodel.ColorID)
        this.Details.fill(this.Detmodel, indx, indx + 1)
        this.resetTheForm()
    }

    CancelEdit() {
        this.resetTheForm()
    }

    resetTheForm() {
        this.detform.controls['ModelID'].enable()
        this.detform.controls['ColorID'].enable()
        this.EditForm = false
        this.Detmodel.ModelID = null
        this.Detmodel = new FinishedStoreDetail();
        this.colorList = null
        this.BatchList = null
        this.detform.reset();
    }
    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value) { return; }
        this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
        this.srvClr.getColor(value).subscribe(clrs => {
            if (this.Detmodel.ModelID) {
                this.colorList = clrs;
                if (this.Detmodel.ColorID && this.EditForm) {
                    this.onColorChange(this.Detmodel.ColorID)
                    if (this.Detmodel.BatchNo && this.EditForm) {
                        this.onBatchChange(this.Detmodel.BatchNo)
                    }
                }
            }
        });
    }

    onColorChange(value) {
        if (!value || !this.colorList) { this.BatchList = null; return; }
        // this.colortext = this.colorList.find(c => c.ColorID == value).ColorName
        this.srvDet.getFinStock(value).subscribe(btc => {
            if (this.Detmodel.ColorID) {
                this.BatchList = btc
                this.Detmodel.Stock = null
                if (this.Detmodel.BatchNo && this.EditForm) {
                    this.onBatchChange(this.Detmodel.BatchNo)
                }
            }
        })
    }

    onBatchChange(value) {
        if (!value || !this.BatchList || value == 'Edit TO Fill This') { return }
        this.Detmodel.Stock = this.BatchList.find(c => c.BatchNo == value).Stock
        this.detform.controls['Quantity'].setValidators([Validators.required, min(0), max(this.Detmodel.Stock)])
        this.detform.controls['Quantity'].updateValueAndValidity()
    }
}