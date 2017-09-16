import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { SalesPayment, CurrentUser, Customer, CustTypes, DeliveryTypes, PayMethods, Model, ModelColor } from '../../../../Models';
import { SalesPaymentService } from '../../../../services';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../../pipes/validators';

@Component({
    selector: 'sorder-payment',
    templateUrl: './payment.html'
})
export class SalesPaymentComponent implements OnInit {
    @Input() Payments: SalesPayment[];
    @Input() Paymodel: SalesPayment;
    @Input() currentUser: CurrentUser;
    @Input() SalesRepExist: boolean;
    @Output() ValidateTotal = new EventEmitter();
    payform: FormGroup;

    constructor(private srvPay: SalesPaymentService, private fb: FormBuilder, public cdr: ChangeDetectorRef) {
        this.payform = fb.group({
            PaymentDate: ['', Validators.required],
            CommDate: [''],
            PayAmount: ['', [min(0)]],
            PayDone: [false],
            CommAmount: ['', [min(0)]],
            CommDone: [false]
        });
        // this.ctrlColorID.valueChanges.subscribe(value => this.onColorChange(value));
    }

    ngOnInit() {
        // this.selectedColor = this.Detmodel.ColorID;
    }

    // ngAfterViewInit() {
    //     if (this.SalesRepExist) {
    //         this.payform.controls['CommDate'].disable()
    //         this.payform.controls['CommAmount'].disable()
    //     }
    //     this.cdr.detectChanges();
    // }

    AddPayment(event) {
        this.Paymodel.UserID = this.currentUser.userID;
        this.Paymodel.UserName = this.currentUser.userName;
        this.Payments.push(this.Paymodel);
        this.Paymodel = new SalesPayment();
        this.ValidateTotal.emit();
        this.payform.reset();
        // event.preventDefault();
    }


}