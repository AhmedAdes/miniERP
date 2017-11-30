import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService, AuthenticationService } from '../../services';
import { emailValidator, matchingPasswords, alreadyExist } from '../../pipes/index';
import { User, CurrentUser, JobClass } from '../../Models';
import { ResizeOptions, ImageResult } from 'ng2-imageupload';

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
  inFrm: FormGroup;
  currentUser: CurrentUser = this.auth.getUser();
  collection: User[] = [];
  searchUser: User = new User();
  classList = JobClass
  model: User;
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  selectedUser: number;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";
  zoomedImageSrc
  stillSaving: boolean
  submitted: boolean

  resizeOptions: ResizeOptions = {
    resizeMaxHeight: 300,
    resizeMaxWidth: 300
  };

  constructor(public serv: UserService,
    private auth: AuthenticationService,
    private fb: FormBuilder) {
    this.inFrm = fb.group({
      'UserID': null,
      'UserName': [null, Validators.required],
      'UserPass': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      'ConfPass': [null, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(200)])],
      'JobClass': [null, Validators.required],
      'photo': [null],
      'Email': [null, emailValidator],
      'Phone': null
    }, { validator: matchingPasswords('UserPass', 'ConfPass') })
  }

  ngOnInit() {
    this.serv.getuser().subscribe(cols => {
      this.collection = cols;
      this.TableBack();
    });
  }
  CreateNew() {
    this.model = new User();
    this.model.Photo = './assets/img/app/profile/avatar5.png'
    this.inFrm.controls['UserName'].setValidators([Validators.required, Validators.maxLength(200),
    alreadyExist(this.collection, 'UserName', '')])
    this.showTable = false;
    this.stillSaving = false
    this.submitted = false
    this.Formstate = 'Create';
    this.headerText = 'Create New User';
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
    this.serv.getuser(id).subscribe(ret => {
      this.model = ret[0];
      if (state == 'Edit') {
        this.inFrm.controls['UserName'].setValidators([Validators.required, Validators.maxLength(200),
        alreadyExist(this.collection, 'UserName', this.model.UserName)])
        this.inFrm.controls['ConfPass'].setValue(this.model.Password);
      }
      let photo, base64String
      if (ret[0].Photo != null) {
        base64String = btoa([].reduce.call(new Uint8Array(ret[0].Photo.data), function (p, c) { return p + String.fromCharCode(c) }, ''))
        photo = "data:image/PNG;base64," + base64String
      } else {
        photo = './assets/img/app/profile/avatar5.png'
      }
      this.model.Photo = photo
      this.showTable = false;
      this.Formstate = state;
      this.headerText = state == 'Detail' ? `User ${state}s` : `${state} User`;
    })
  }
  TableBack() {
    this.inFrm.reset()
    this.showTable = true;
    this.Formstate = null;
    this.headerText = 'Users';
    this.errorMessage = null;
    this.stillSaving = false
    this.submitted = false
  }
  HandleForm() {
    this.submitted = true
    if (this.inFrm.invalid) return
    if (this.stillSaving) return
    this.stillSaving = true
    var newUser: User = this.model;
    newUser.DirectManager = this.currentUser.userID;
    newUser.Photo = document.getElementById("ImgUser").getAttribute("src") === "./assets/img/app/profile/avatar5.png" ? null : document.getElementById("ImgUser").getAttribute("src").split(",")[1]
    switch (this.Formstate) {
      case 'Create':
        this.serv.InsertUser(newUser).subscribe(ret => {
          if (ret.error) {
            this.stillSaving = false
            this.errorMessage = ret.error.message || ret.error.originalError.info.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        });
        break;
      case 'Edit':
        this.serv.UpdateUser(newUser.UserID, newUser).subscribe(ret => {
          if (ret.error) {
            this.stillSaving = false
            this.errorMessage = ret.error.message || ret.error.originalError.info.message;
          } else if (ret.affected > 0) {
            this.ngOnInit();
          }
        });
        break;
      case 'Delete':
        this.serv.DeleteUser(newUser.UserID).subscribe(ret => {
          if (ret.error) {
            this.stillSaving = false
            this.errorMessage = ret.error.message || ret.error.originalError.info.message;
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
  selected(imageResult: ImageResult) {
    this.zoomedImageSrc = imageResult.dataURL
    this.model.Photo = imageResult.resized
      && imageResult.resized.dataURL
      || imageResult.dataURL;
  }
}
