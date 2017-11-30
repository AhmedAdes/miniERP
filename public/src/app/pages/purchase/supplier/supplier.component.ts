import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, SupplierService } from '../../../services';
import { Supplier, CurrentUser, CustTypes } from '../../../Models';
import * as hf from '../../helper.functions'

@Component({
    selector: 'app-supplier',
    templateUrl: './supplier.component.html',
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
export class SupplierComponent implements OnInit {

    constructor(public serv: SupplierService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: Supplier[] = [];
    model: Supplier;
    srchObj: Supplier = new Supplier();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    cnvContractDate: string;

    ngOnInit() {
        this.serv.getSupplier().subscribe(cols => this.collection = cols);
        this.TableBack();
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
    CreateNew() {
        this.model = new Supplier();
        this.cnvContractDate = this.HandleDate(new Date());
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Supplier';
    }

    EditThis(id: number) {
        this.serv.getSupplier(id).subscribe(mat => {
            this.model = mat[0];
            this.cnvContractDate = this.HandleDate(new Date(this.model.ContractDate));
            this.showTable = false;
            this.Formstate = 'Edit';
            this.headerText = 'Edit Supplier';
        });
    }
    ShowDetails(id: number) {
        this.serv.getSupplier(id).subscribe(mat => {
            this.model = mat[0];
            this.cnvContractDate = this.HandleDate(new Date(this.model.ContractDate));
            this.showTable = false;
            this.Formstate = 'Detail';
            this.headerText = 'Supplier Details';
        });
    }
    Delete(id: number) {
        this.serv.getSupplier(id).subscribe(mat => {
            this.model = mat[0];
            this.cnvContractDate = this.HandleDate(new Date(this.model.ContractDate));
            this.showTable = false;
            this.Formstate = 'Delete';
            this.headerText = 'Delete Supplier';
        });
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Suppliers';
        this.errorMessage = null;
    }
    HandleForm(event) {
        event.preventDefault();
        this.model.UserID = this.currentUser.userID;
        this.model.ContractDate = new Date(this.cnvContractDate)

        switch (this.Formstate) {
            case 'Create':
                this.serv.insertSupplier(this.model).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.serv.updateSupplier(this.model.SupID, this.model).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.serv.deleteSupplier(this.model.SupID).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
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
