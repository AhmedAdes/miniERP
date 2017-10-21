import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, RegionService, ProvinceService } from '../../../services';
import { Region, Province, CurrentUser } from '../../../Models';

@Component({
    selector: 'app-region',
    templateUrl: './region.component.html',
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
export class RegionComponent implements OnInit {

    constructor(public serv: RegionService, private srvProv: ProvinceService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: Region[] = [];
    provinces: Province[] = [];
    model: Region;
    srchObj: Region = new Region();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";

    ngOnInit() {
        this.serv.getRegion().subscribe(cols => {
            this.collection = cols
            this.srvProv.getProvince().subscribe(prv => this.provinces = prv[0])
            this.TableBack();
        });
    }

    CreateNew() {
        this.model = new Region();
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Region';
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
        this.serv.getRegion(id).subscribe(rgn => {
            this.model = rgn[0];
            this.showTable = false;
            this.Formstate = state;
            this.headerText = state == 'Detail' ? `Region ${state}s` : `${state} Region`;
        })
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Regions';
        this.errorMessage = null;
    }
    HandleForm(event) {
        event.preventDefault();

        switch (this.Formstate) {
            case 'Create':
                this.serv.insertRegion(this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.serv.updateRegion(this.model.RegionID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.serv.deleteRegion(this.model.RegionID).subscribe(ret => {
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
