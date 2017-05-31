import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CurrentUser, MaterialStoreDetail, QC, Material } from '../../../Models/index';
import { MaterialService, AccessoryService, MatDetailService } from '../../../services/index';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../pipes/validators';

@Component({
    selector: 'mat-disp-detail',
    templateUrl: './details.component.html'
})
export class MatDispDetailsComponent implements OnInit, OnChanges {
    @Input() Details: MaterialStoreDetail[];
    @Input() Detmodel: MaterialStoreDetail;
    @Input() currentUser: CurrentUser;
    @Input() materialList: Material[];
    // @Input() BatchNo: string;
    // colorList: ModelColor[];
    QCList: QC[];
    colortext: string;
    selectedMaterial: Material;
    selectedMaterialID: number;
    detform: FormGroup;
    EditForm: boolean = false;

    constructor(private srvMat: MaterialService, private srvDet: MatDetailService, private fb: FormBuilder) {
        this.detform = fb.group({
            MaterialID: ['', Validators.required],
            QCNO: ['', Validators.required],
            Stock: [''],
            Quantity: ['', [Validators.required, min(0)]],
        });
        this.detform.controls['MaterialID'].valueChanges.subscribe(value => this.onMaterialChange(value));
        this.detform.controls['QCNO'].valueChanges.subscribe(value => this.onQCChange(value));
    }

    ngOnInit() {
        this.selectedMaterialID = this.Detmodel.MaterialID;
        // this.selectedColor = this.Detmodel.ColorID;
    }

    ngOnChanges() {
        if (this.Detmodel.MaterialID) {
            this.EditForm = true;
            this.detform.controls['MaterialID'].disable()
            this.selectedMaterialID = this.Detmodel.MaterialID;
        }
    }

    prepareDetail() {
        this.Detmodel.MaterialID = this.selectedMaterialID;
        this.Detmodel.MaterialName = this.selectedMaterial.MaterialName;
        // this.Detmodel.ColorName = this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
        this.Detmodel.RecordDate = new Date();
    }
    AddDetail(event) {
        event.preventDefault();
        this.prepareDetail();
        if (this.Details.findIndex(x => x.MaterialID == this.Detmodel.MaterialID) > -1) {
            var indx = this.Details.findIndex(x => x.MaterialID == this.Detmodel.MaterialID)
            this.Details.fill(this.Detmodel, indx, indx + 1)
        } else {
            this.Details.push(this.Detmodel);
        }
        this.resetTheForm()
    }

    EditDetail() {
        this.prepareDetail();
        var indx = this.Details.findIndex(x => x.MaterialID == this.Detmodel.MaterialID)
        this.Details.fill(this.Detmodel, indx, indx + 1)
        this.resetTheForm()
    }

    CancelEdit() {
        this.resetTheForm()
    }

    resetTheForm() {
        this.detform.controls['MaterialID'].enable()
        this.Detmodel = new MaterialStoreDetail();
        this.detform.reset();
        this.EditForm = false
    }
    onMaterialChange(value) {
        //newObj.target.value.split(":")[0]
        if (!value) { return }
        this.srvDet.getMatStock(value).subscribe(clrs => {
            this.QCList = clrs;
            this.selectedMaterial = this.materialList.filter(obj => obj.MaterialID == value)[0];
            if (this.Detmodel.QCNO && this.EditForm) {
                this.onQCChange(this.Detmodel.QCNO)
            }
        });
    }

    onQCChange(value) {
        if (!value || !this.QCList) { return }
        this.Detmodel.Stock = this.QCList.find(c => c.QCNO == value).Stock
        this.detform.controls['Quantity'].setValidators([Validators.required, min(0), max(this.Detmodel.Stock)])
        this.detform.controls['Quantity'].updateValueAndValidity()
    }
}