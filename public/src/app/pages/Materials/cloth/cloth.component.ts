import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { MaterialService, AuthenticationService } from '../../../services';
import { Material, CurrentUser } from '../../../Models';

@Component({
  selector: 'app-cloth',
  templateUrl: './cloth.component.html',
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
export class ClothComponent implements OnInit {
  
  constructor(public serv: MaterialService, private auth: AuthenticationService) { }

  currentUser: CurrentUser = this.auth.getUser(); 
  collection: Material[] = [];
  model: Material;
  srchMat: Material = new Material();
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";

  ngOnInit() {
    this.serv.getCloth().subscribe(cols => this.collection = cols);
    this.TableBack();
  }

  CreateNew() {
    this.model = new Material();
    this.model.Category = 'Cloth';
    this.showTable = false;
    this.Formstate = 'Create';
    this.headerText = 'Create New Fabric';
  }

  EditThis(id: number) {
    this.serv.getCloth(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Edit';
      this.headerText = 'Edit Fabric';
    });
  }
  ShowDetails(id: number) {
    this.serv.getCloth(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Detail';
      this.headerText = 'Fabric Details';
    });
  }
  Delete(id: number) {
    this.serv.getCloth(id).subscribe(mat => {
      this.model = mat[0];
      this.showTable = false;
      this.Formstate = 'Delete';
      this.headerText = 'Delete Fabric';
    });
  }
  TableBack() {
    this.showTable = true;
    this.Formstate = null;
    this.headerText = 'Fabrics';
    this.errorMessage = null;
  }
  HandleForm(event) {
    event.preventDefault();
    this.model.UserID = this.currentUser.userID;

    switch (this.Formstate) {
      case 'Create':
        this.serv.insertMaterial(this.model).subscribe(ret => {
          if(ret.error){
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err=> this.errorMessage = err.message );
        break;
      case 'Edit':
        this.serv.updateMaterial(this.model.MaterialID, this.model).subscribe(ret => {
          if(ret.error){
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err=> this.errorMessage = err.message );
        break;
      case 'Delete':
        this.serv.deleteMaterial(this.model.MaterialID).subscribe(ret => {
          if(ret.error){
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        }, err=> this.errorMessage = err.message );
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
