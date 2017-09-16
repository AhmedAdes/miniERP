import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SalesHeader, CurrentUser, Customer, SalesRep, DeliveryTypes, PayMethods } from '../../../../Models';
import { CustomerService, SalesRepService } from '../../../../services';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'sales-header',
    templateUrl: './header.html'
})
export class SalesHeaderComponent implements OnInit {
    @Input() model: SalesHeader;
    @Input() currentUser: CurrentUser;
    @Output() custChanged = new EventEmitter();
    @Output() CalculateTotal = new EventEmitter();
    @Output() formValid = new EventEmitter();
    @Output() changeRepExist = new EventEmitter();
    customerList: Customer[];
    repsList: SalesRep[];
    DeliveryList = DeliveryTypes;
    PayList = PayMethods;
    srchObj: SalesHeader = new SalesHeader();
    headerForm: FormGroup;
    cnvSODate: string;
    cnvDeliveryDate: string;

    constructor(public srvCust: CustomerService, public srvRep: SalesRepService, fb: FormBuilder) {
        this.headerForm = fb.group({
            SODate: ['', Validators.required],
            CustID: ['', Validators.required],
            SalesTax: [''],
            Discount: [''],
            PayMethod: [''],
            DeliveryType: [''],
            DeliveryDate: [''],
            SalesRepID: [''],
            Notes: [''],
        });

        this.headerForm.valueChanges.subscribe(value => this.onFormValid(value));
        // this.headerForm.controls['CustID'].valueChanges.subscribe(value => this.onCustChanged(value));
        // this.headerForm.controls['SalesTax'].valueChanges.subscribe(value => this.onTaxChange(value));
        // this.headerForm.controls['Discount'].valueChanges.subscribe(value => this.onDiscountChange(value));
        this.headerForm.controls['SODate'].valueChanges.subscribe(value => this.onSODatechange(value));
        this.headerForm.controls['DeliveryDate'].valueChanges.subscribe(value => this.onDelvDatechange(value));
        this.headerForm.controls['SalesRepID'].valueChanges.subscribe(value => this.onRepchange(value));
    }

    ngOnInit() {
        this.srvCust.getCustomer().subscribe(cols => {
            this.customerList = cols;
            this.cnvSODate = this.model.SODate ? this.HandleDate(new Date(this.model.SODate)) : this.HandleDate(new Date());
            this.cnvDeliveryDate = this.model.DeliveryDate ? this.HandleDate(new Date(this.model.DeliveryDate)) : this.HandleDate(new Date());
            this.srvRep.getSalesRep().subscribe(Reps => this.repsList = Reps)
        });
    }

    HandleDate(date: Date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        var goodDate: Date = new Date(yyyy + "/" + mm + "/" + dd);
        goodDate.setDate(goodDate.getDate() + 1);
        var Ret = goodDate.toISOString();
        return goodDate.toISOString().substring(0, 10);
    }

    onCustChanged(newObj) {
        this.custChanged.emit(newObj.target.value.split(":")[0]);
    }

    onTaxChange(value) {
        this.CalculateTotal.emit();
    }
    onDiscountChange(value) {
        this.CalculateTotal.emit();
    }
    onSODatechange(value) {
        if (value) {
            this.model.SODate = value;
        }
    }
    onDelvDatechange(value) {
        if (value) {
            this.model.DeliveryDate = value;
        }
    }
    onRepchange(value) {
        if (this.repsList) {
            this.changeRepExist.emit(value ? true : false);
        }
    }
    onFormValid(value) {
        this.formValid.emit(this.headerForm.valid);
    }
}