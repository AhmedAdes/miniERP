import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SalesDetail, CurrentUser, Customer, CustTypes, DeliveryTypes, PayMethods, Model, ModelColor } from '../../../../Models';
import { ModelService, ColorService, CustomerService } from '../../../../services';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../../pipes/validators';

@Component({
    selector: 'sales-detail',
    templateUrl: './detail.html'
})
export class SalesDetailComponent implements OnInit {
    @Input() Details: SalesDetail[];
    @Input() Detmodel: SalesDetail;
    @Input() currentUser: CurrentUser;
    @Input() CustomerID: number;
    @Input() modelsList: Model[];
    @Output() CalculateTotal = new EventEmitter();
    colorList: ModelColor[];
    colortext: string;
    selectedModel: Model;
    selectedModelID: number;
    detform: FormGroup;
    ctrlModelID: AbstractControl;
    ctrlColorID: AbstractControl;
    ctrlQuant: AbstractControl;
    ctrlPrice: AbstractControl;

    constructor(private srvClr: ColorService, private srvCust: CustomerService, private fb: FormBuilder) {
        this.detform = fb.group({
            modelId: ['', Validators.required],
            colorId: ['', Validators.required],
            quant: ['', [Validators.required, min(0)]],
            price: ['', [Validators.required, min(0)]]
        });

        this.ctrlModelID = this.detform.controls['modelId'];
        this.ctrlColorID = this.detform.controls['colorId'];
        this.ctrlQuant = this.detform.controls['quant'];
        this.ctrlPrice = this.detform.controls['price'];

        this.ctrlModelID.valueChanges.subscribe(value => this.onProdChange(value));
        // this.ctrlColorID.valueChanges.subscribe(value => this.onColorChange(value));
    }

    ngOnInit() {
        this.selectedModelID = this.Detmodel.ModelID;
        // this.selectedColor = this.Detmodel.ColorID;
    }

    AddDetail(event) {
        this.Detmodel.ModelID = this.selectedModelID;
        this.Detmodel.ModelName = this.selectedModel.ModelName;
        this.Detmodel.ModelCode = this.selectedModel.ModelCode;
        this.Detmodel.ColorName = this.colortext;
        this.Detmodel.UserID = this.currentUser.userID;
        this.Details.push(this.Detmodel);
        this.Detmodel = new SalesDetail();
        this.selectedModelID = null;
        this.CalculateTotal.emit();
        this.detform.reset();
        // event.preventDefault();
    }

    onProdChange(value) {
        //newObj.target.value.split(":")[0]
        var CustType;
        if (!value) { return }
        this.srvClr.getColor(value).subscribe(clrs => {
            this.colorList = clrs;
            this.selectedModel = this.modelsList.filter(obj => obj.ModelID == value)[0];
            if (this.CustomerID) {
                this.srvCust.getCustomer(this.CustomerID).subscribe(cst => {
                    CustType = cst[0].CustType;
                    switch (CustType) {
                        case CustTypes[0].name:
                            this.Detmodel.Price = this.selectedModel.PriceWholeSale;
                            break;
                        case CustTypes[1].name:
                            this.Detmodel.Price = this.selectedModel.PriceStores;
                            break;
                        case CustTypes[2].name:
                            this.Detmodel.Price = this.selectedModel.PricePiece;
                            break;
                        default:
                            break;
                    }
                })
            }
        });
    }

    onColorChange(newObj) {
        this.colortext = newObj.target.selectedOptions[0].text;
    }
}