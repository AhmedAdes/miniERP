import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, ProvinceService } from '../../../services';
import { Province, CurrentUser } from '../../../Models';

@Component({
    selector: 'app-province',
    templateUrl: './province.component.html',
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
export class ProvinceComponent implements OnInit {

    constructor(public serv: ProvinceService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: Province[] = [];
    model: Province;
    srchObj: Province = new Province();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";

    ngOnInit() {
        this.serv.getProvince().subscribe(cols => this.collection = cols);
        this.TableBack();
    }

    CreateNew() {
        this.model = new Province();
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Province';
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
        this.serv.getProvince(id).subscribe(prv => {
            this.model = prv[0];
            this.showTable = false;
            this.Formstate = state;
            this.headerText = state == 'Detail' ? `Province ${state}s` : `${state} Province`;
        })
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Provinces';
        this.errorMessage = null;
    }
    HandleForm(event) {
        event.preventDefault();

        switch (this.Formstate) {
            case 'Create':
                this.serv.insertProvince(this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.serv.updateProvince(this.model.ProvinceID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.serv.deleteProvince(this.model.ProvinceID).subscribe(ret => {
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
