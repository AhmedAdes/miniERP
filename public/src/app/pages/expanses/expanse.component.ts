import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, ExpansesService } from '../../services';
import { Expanses, CurrentUser } from '../../Models';
import * as hf from '../helper.functions'

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
        this.serv.getExpanses().subscribe(cols => this.collection = cols, err => hf.handleError(err));
        this.TableBack();
    }

    CreateNew() {
        this.model = new Expanses();
        this.cnvRecDate = this.model.ExpanseDate ? hf.handleDate(new Date(this.model.ExpanseDate)) : hf.handleDate(new Date());
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
            this.cnvRecDate = this.model.ExpanseDate ? hf.handleDate(new Date(this.model.ExpanseDate)) : hf.handleDate(new Date());
            this.showTable = false;
            this.Formstate = state;
            this.headerText = state == 'Detail' ? `Expanses ${state}s` : `${state} Expanses`;
        }, err => hf.handleError(err))
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
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.serv.updateExpanses(this.model.ExpanseID, this.model).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.serv.deleteExpanses(this.model.ExpanseID).subscribe(ret => {
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
