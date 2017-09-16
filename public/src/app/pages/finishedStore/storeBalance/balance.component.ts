import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinStoreService } from '../../../services';
import { FinishedStore, CurrentUser } from '../../../Models';

@Component({
    selector: 'fin-balance',
    templateUrl: './balance.component.html',
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
export class StoreBalanceComponent implements OnInit {

    constructor(public serv: FinStoreService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: FinishedStore[] = [];
    model: FinishedStore;
    srchObj: FinishedStore = new FinishedStore();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";

    ngOnInit() {
        this.serv.getStoreBalance().subscribe(cols => this.collection = cols);
        this.TableBack();
    }
    
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.errorMessage = null;
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
