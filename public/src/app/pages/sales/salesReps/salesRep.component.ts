import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, SalesRepService } from '../../services/index';
import { SalesRep, CurrentUser } from '../../Models/index';

@Component({
  selector: 'sales-rep',
  templateUrl: './salesRep.html',
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
export class SalesRepComponent implements OnInit {

  constructor(public serv: SalesRepService, private auth: AuthenticationService) { }

  currentUser: CurrentUser = this.auth.getUser();
  collection: SalesRep[] = [];
  model: SalesRep;
  srchObj: SalesRep = new SalesRep();
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";

  ngOnInit() {
    this.serv.getSalesRep().subscribe(cols => this.collection = cols);
    this.TableBack();
  }

  CreateNew() {
    this.model = new SalesRep();
    this.showTable = false;
    this.Formstate = 'Create';
    this.headerText = 'Create New SalesRep';
  }

  EditThis(id: number) {
    this.serv.getSalesRep(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Edit';
      this.headerText = 'Edit SalesRep';
    });
  }
  ShowDetails(id: number) {
    this.serv.getSalesRep(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Detail';
      this.headerText = 'SalesRep Details';
    });
  }
  Delete(id: number) {
    this.serv.getSalesRep(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Delete';
      this.headerText = 'Delete SalesRep';
    });
  }
  TableBack() {
    this.showTable = true;
    this.Formstate = null;
    this.headerText = 'SalesReps';
    this.errorMessage = null;
  }
  HandleForm(event) {
    event.preventDefault();

    switch (this.Formstate) {
      case 'Create':
        this.serv.insertSalesRep(this.model).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err => this.errorMessage = err.message);
        break;
      case 'Edit':
        this.serv.updateSalesRep(this.model.SalesRepID, this.model).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err => this.errorMessage = err.message);
        break;
      case 'Delete':
        this.serv.deleteSalesRep(this.model.SalesRepID).subscribe(ret => {
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
