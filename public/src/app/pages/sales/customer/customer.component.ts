import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, CustomerService, ProvinceService, RegionService } from '../../../services';
import { FormBuilder, FormGroup, Validators, AbstractControl, PatternValidator } from '@angular/forms';
import { Customer, CurrentUser, CustTypes, Province, Region } from '../../../Models';
import { alreadyExist } from '../../../pipes/validators'
import * as hf from '../../helper.functions'

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    animations: [
        trigger(
            'myAnimation', [
                transition(':enter', [
                    style({ transform: 'translateX(100%)', opacity: 0 }),
                    animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'translateX(0)', 'opacity': 1 }),
                    animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})
export class CustomerComponent implements OnInit {

    currentUser: CurrentUser = this.auth.getUser();
    collection: Customer[] = [];
    provList: Province[] = [];
    regList: Region[] = [];
    allRegions: Region[] = [];
    model: Customer;
    srchObj: Customer = new Customer();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    CustTypeList = CustTypes;
    stillSaving: boolean
    submitted: boolean
    inFrm: FormGroup;
    custName; contact; custType; country; prov: AbstractControl; region: AbstractControl
    carea; address; tel; email; website

    constructor(public serv: CustomerService, private auth: AuthenticationService,
        private srvReg: RegionService, private srvProv: ProvinceService, fb: FormBuilder) {
        this.inFrm = fb.group({
            'custName': [null, Validators.required],
            'contact': [null, Validators.required],
            'custType': [null, Validators.required],
            'country': [null],
            'area': [null],
            'province': [null, Validators.required],
            'region': [null, Validators.required],
            'address': [null],
            'tel': [null, Validators.required],
            'email': [null],
            'website': [null]
        })

        this.custName = this.inFrm.get('custName')
        this.contact = this.inFrm.get('contact')
        this.custType = this.inFrm.get('custType')
        this.country = this.inFrm.get('country')
        this.carea = this.inFrm.get('area')
        this.prov = this.inFrm.get('province')
        this.region = this.inFrm.get('region')
        this.address = this.inFrm.get('address')
        this.tel = this.inFrm.get('tel')
        this.email = this.inFrm.get('email')
        this.website = this.inFrm.get('website')

        this.prov.valueChanges.subscribe(val => this.onProvinceChanged(val))
    }

    ngOnInit() {
        this.srvProv.getProvince().subscribe(prv => {
            this.provList = prv
            this.srvReg.getRegion().subscribe(reg => {
                this.allRegions = reg
                if (this.currentUser.jobClass === 0) {
                    this.serv.getCustomer().subscribe(cols => {
                        this.collection = cols
                    })
                }else {
                    this.serv.getCustomerforUser(this.currentUser.userID).subscribe(cols => {
                        this.collection = cols
                    })
                }

                this.TableBack()
            })
        });
    }

    CreateNew() {
        this.model = new Customer();
        this.tel.setValidators([Validators.required, alreadyExist(this.collection, 'Tel', '')])
        this.showTable = false;
        this.stillSaving = false
        this.submitted = false
        this.Formstate = 'Create';
        this.headerText = 'Create New Customer';
    }

    EditThis(id: number) {
        this.LoadDetails(id, 'Edit')
    }
    ShowDetails(id: number) {
        this.LoadDetails(id, 'Detail')
    }
    Delete(id: number) {
        this.LoadDetails(id, 'Delete')
    }
    LoadDetails(id, state) {
        this.serv.getCustomer(id).subscribe(mat => {
            this.model = mat[0];
            if (state == 'Edit') {
                this.tel.setValidators([Validators.required, alreadyExist(this.collection, 'Tel', this.model.Tel)])
            }
            this.showTable = false;
            this.Formstate = state
            this.headerText = state == 'Detail' ? `Customer ${state}s` : `${state} Customer`;
        });
    }
    TableBack() {
        this.inFrm.reset()
        this.country.disable()
        this.carea.disable()
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Customers';
        this.errorMessage = null;
        this.stillSaving = false
        this.submitted = false
    }
    HandleForm(event) {
        event.preventDefault();
        this.submitted = true
        if (this.inFrm.invalid) return
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID;
        this.model.Tel = this.model.Tel.replace('/', '-').replace('+', '-');

        switch (this.Formstate) {
            case 'Create':
                this.serv.insertCustomer(this.model).subscribe(ret => {
                    if (ret.error) {
                        this.stillSaving = false
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.serv.updateCustomer(this.model.CustID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.stillSaving = false
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.serv.deleteCustomer(this.model.CustID).subscribe(ret => {
                    if (ret.error) {
                        this.stillSaving = false
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => {
                    hf.handleError(err)
                    this.stillSaving = false
                });
                break;

            default:
                break;
        }
    }
    onProvinceChanged(value: number) {
        if (!value) { this.regList = []; return; }
        this.regList = this.allRegions.filter(r => r.ProvinceID == value)
    }
    SortTable(column: string) {
        if (this.orderbyString.indexOf(column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-asc";
            this.orderbyString = '+' + column;
        } else if (this.orderbyString.indexOf('-' + column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-desc";
            this.orderbyString = '-' + column;
        } else {
            this.orderbyClass = 'fa fa-sort';
            this.orderbyString = '';
        }
    }
}
