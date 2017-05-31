import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService, AuthenticationService } from '../services/index';
import { emailValidator, matchingPasswords } from '../pipes/index';
import { User, CurrentUser } from '../Models/index';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
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
      ])
  ]
})
export class UserComponent implements OnInit {
  inputForm: FormGroup;

  constructor(public serv: UserService,
    private auth: AuthenticationService,
    private fb: FormBuilder) {
    this.inputForm = fb.group({
      'UserID': null,
      'UserName': [null, Validators.required],
      'LoginName': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      'UserPass': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      'ConfPass': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      'JobClass': [null, Validators.required],
      'Email': [null, emailValidator],
      'Phone': null
    }, { validator: matchingPasswords('UserPass', 'ConfPass') })
  }

  currentUser: CurrentUser = this.auth.getUser();
  collection: User[] = [];
  searchUser: User = new User();
  model: User;
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  selectedRegion: number;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";

  ngOnInit() {
    this.serv.getuser().subscribe(cols => {
      this.collection = cols;
      this.TableBack();
    });
  }
  CompleteLogin() {
    if (this.model.UserName != "") {
      var sp = this.model.UserName.split(" ");
      this.model.LoginName = sp[0].charAt(0) + '.' + sp[sp.length - 1];
    }
  }
  CreateNew() {
    this.model = new User();
    this.showTable = false;
    this.Formstate = 'Create';
    this.headerText = 'Create New User';
  }

  EditThis(id: number) {

    this.serv.getuser(id).subscribe(ret => {
      this.model = ret[0];
      this.showTable = false;
      this.Formstate = 'Edit';
      this.headerText = 'Edit User';
    });
  }
  ShowDetails(id: number) {
    this.serv.getuser(id).subscribe(ret => {
      this.model = ret[0];
      this.showTable = false;
      this.Formstate = 'Detail';
      this.headerText = 'User Details';
    });
  }
  Delete(id: number) {
    this.serv.getuser(id).subscribe(ret => {
      this.model = ret[0];
      this.showTable = false;
      this.Formstate = 'Delete';
      this.headerText = 'Delete User';
    });
  }
  TableBack() {
    this.showTable = true;
    this.Formstate = null;
    this.headerText = 'Users';
    this.errorMessage = null;
  }
  HandleForm(event) {
    event.preventDefault();
    var newUser: User = this.model;
    newUser.DirectManager = this.currentUser.userID;
    switch (this.Formstate) {
      case 'Create':
        this.serv.InsertUser(newUser).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        });
        break;
      case 'Edit':
        this.serv.UpdateUser(newUser.UserID, newUser).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        });
        break;
      case 'Delete':
        this.serv.DeleteUser(newUser.UserID).subscribe(ret => {
          if (ret.error) {
            this.errorMessage = ret.error.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        });
        break;
      default:
        break;
    }
  }

  ApproveUser(id: number) {
    this.serv.ApproveUser(id, this.currentUser.userID).subscribe(ret => {
      if (ret.error) {
        this.errorMessage = ret.error.message;
      } else if (ret.affected > 0) {
        this.ngOnInit();
      }
    });
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
