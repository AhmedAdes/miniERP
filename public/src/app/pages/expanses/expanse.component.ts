import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, ExpansesService } from '../services/index';
import { Expanses, CurrentUser } from '../Models/index';

@Component({
    selector: 'app-expanse',
    templateUrl: './expanse.component.html',
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
export class ExpansesComponent implements OnInit {

    constructor(public serv: ExpansesService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: Expanses[] = [];
    model: Expanses;
    srchObj: Expanses = new Expanses();
    showTable: boolean;
    cnvRecDate: string;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    stillSaving: boolean

    ngOnInit() {
        this.serv.getExpanses().subscribe(cols => this.collection = cols);
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
        this.model = new Expanses();
        this.cnvRecDate = this.model.ExpanseDate ? this.HandleDate(new Date(this.model.ExpanseDate)) : this.HandleDate(new Date());
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Expanses';
    }
    EditThis(id: number) {
        this.LoadDetails(id, 'Edit');
    }
    ShowDetails(id: number) {
        this.LoadDetails(id, 'Detail');
    }
    Delete(id: number) {
        this.LoadDetails(id, 'Delete');
    }
    LoadDetails(id, state) {
        this.serv.getExpanses(id).subscribe(mat => {
            this.model = mat[0];
            this.cnvRecDate = this.model.ExpanseDate ? this.HandleDate(new Date(this.model.ExpanseDate)) : this.HandleDate(new Date());
            this.showTable = false;
            this.Formstate = state;
            this.headerText = state == 'Detail' ? `Expanses ${state}s` : `${state} Expanses`;
        })
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Expanses';
        this.errorMessage = null;
        this.stillSaving = false
    }
    HandleForm(event) {
        event.preventDefault();
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID;

        switch (this.Formstate) {
            case 'Create':
                this.serv.insertExpanses(this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.serv.updateExpanses(this.model.ExpanseID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.serv.deleteExpanses(this.model.ExpanseID).subscribe(ret => {
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
