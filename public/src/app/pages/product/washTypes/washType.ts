import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, WashTypeService } from '../../../services';
import { WashType, CurrentUser } from '../../../Models';
import * as hf from '../../helper.functions'

@Component({
  selector: 'app-wash',
  templateUrl: './washType.html',
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
export class WashTypeComponent implements OnInit {

  constructor(public serv: WashTypeService, private auth: AuthenticationService) { }

  currentUser: CurrentUser = this.auth.getUser();
  collection: WashType[] = [];
  model: WashType;
  srchObj: WashType = new WashType();
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";

  ngOnInit() {
    this.serv.getWashType().subscribe(cols => this.collection = cols);
    this.TableBack();
  }

  CreateNew() {
    this.model = new WashType();
    this.showTable = false;
    this.Formstate = 'Create';
    this.headerText = 'Create New WashType';
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
    this.serv.getWashType(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = state;
      this.headerText = state == 'Detail' ? `WashType ${state}s` : `${state} WashType`;
    })
  }
  TableBack() {
    this.showTable = true;
    this.Formstate = null;
    this.headerText = 'WashTypes';
    this.errorMessage = null;
  }
  HandleForm(event) {
    event.preventDefault();
    this.model.UserID = this.currentUser.userID;

    switch (this.Formstate) {
      case 'Create':
        this.serv.insertWashType(this.model).subscribe(ret => {
          if (ret.error) {
            hf.handleError(ret.error)
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err => hf.handleError(err));
        break;
      case 'Edit':
        this.serv.updateWashType(this.model.WashID, this.model).subscribe(ret => {
          if (ret.error) {
            hf.handleError(ret.error)
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err => hf.handleError(err));
        break;
      case 'Delete':
        this.serv.deleteWashType(this.model.WashID).subscribe(ret => {
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
