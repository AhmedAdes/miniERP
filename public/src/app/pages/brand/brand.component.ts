import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, BrandService } from '../../services';
import { Brand, CurrentUser } from '../../Models';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
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
export class BrandComponent implements OnInit {

  constructor(public serv: BrandService, private auth: AuthenticationService) { }

  currentUser: CurrentUser = this.auth.getUser();
  collection: Brand[] = [];
  model: Brand;
  srchObj: Brand = new Brand();
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";

  ngOnInit() {
    this.serv.getBrand().subscribe(cols => this.collection = cols);
    this.TableBack();
  }

  CreateNew() {
    this.model = new Brand();
    this.showTable = false;
    this.Formstate = 'Create';
    this.headerText = 'Create New Brand';
  }

  EditThis(id: number) {
    this.serv.getBrand(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Edit';
      this.headerText = 'Edit Brand';
    });
  }
  ShowDetails(id: number) {
    this.serv.getBrand(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Detail';
      this.headerText = 'Brand Details';
    });
  }
  Delete(id: number) {
    this.serv.getBrand(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Delete';
      this.headerText = 'Delete Brand';
    });
  }
  TableBack() {
    this.showTable = true;
    this.Formstate = null;
    this.headerText = 'Brands';
    this.errorMessage = null;
  }
  HandleForm(event) {
    event.preventDefault();
    this.model.UserID = this.currentUser.userID;

    switch (this.Formstate) {
      case 'Create':
        this.serv.insertBrand(this.model).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err => this.errorMessage = err.message);
        break;
      case 'Edit':
        this.serv.updateBrand(this.model.BrandID, this.model).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err => this.errorMessage = err.message);
        break;
      case 'Delete':
        this.serv.deleteBrand(this.model.BrandID).subscribe(ret => {
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
