import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurrentUser, Model, ModelColor, FinishedStoreDetail } from '../../../Models/index';
import { ModelService, ColorService, FinDetailService } from '../../../services/index';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../pipes/validators';

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
    colortext: string;
    selectedModel: Model;
    selectedModelID: number;
    detform: FormGroup;
    EditForm: boolean = false;

    constructor(private srvClr: ColorService, private srvDet: FinDetailService, private fb: FormBuilder) {
        this.detform = fb.group({
            ModelID: ['', Validators.required],
            ColorID: ['', Validators.required],
            Quantity: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['ModelID'].valueChanges.subscribe(value => this.onProdChange(value));
        // this.ctrlColorID.valueChanges.subscribe(value => this.onColorChange(value));
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
        this.Detmodel.ModelID = this.selectedModelID;
        this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ColorName = this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
        this.Detmodel.RecordDate = new Date();
        this.Detmodel.BatchNo = this.BatchNo;
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
        this.Detmodel = new FinishedStoreDetail();
        this.detform.reset();
        this.EditForm = false
    }
    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value) { return }
        this.srvClr.getColor(value).subscribe(clrs => {
            this.colorList = clrs;
            this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
        });
    }

    onColorChange(newObj) {
        this.colortext = newObj.target.selectedOptions[0].text;
    }
}