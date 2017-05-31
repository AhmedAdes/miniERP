import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, CustomerService } from '../../services/index';
import { Customer, CurrentUser, CustTypes } from '../../Models/index';

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

    constructor(public serv: CustomerService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: Customer[] = [];
    model: Customer;
    srchObj: Customer = new Customer();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    CustTypeList = CustTypes;

    ngOnInit() {
        this.serv.getCustomer().subscribe(cols => this.collection = cols);
        this.TableBack();
    }

    CreateNew() {
        this.model = new Customer();
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Customer';
    }

    EditThis(id: number) {
        this.serv.getCustomer(id).subscribe(mat => {
            this.model = mat[0];
            this.showTable = false;
            this.Formstate = 'Edit';
            this.headerText = 'Edit Customer';
        });
    }
    ShowDetails(id: number) {
        this.serv.getCustomer(id).subscribe(mat => {
            this.model = mat[0];
            this.showTable = false;
            this.Formstate = 'Detail';
            this.headerText = 'Customer Details';
        });
    }
    Delete(id: number) {
        this.serv.getCustomer(id).subscribe(mat => {
            this.model = mat[0];
            this.showTable = false;
            this.Formstate = 'Delete';
            this.headerText = 'Delete Customer';
        });
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Customers';
        this.errorMessage = null;
    }
    HandleForm(event) {
        event.preventDefault();
        this.model.UserID = this.currentUser.userID;

        switch (this.Formstate) {
            case 'Create':
                this.serv.insertCustomer(this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.serv.updateCustomer(this.model.CustID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.serv.deleteCustomer(this.model.CustID).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;

            default:
                break;
        }
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
