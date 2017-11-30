import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService, AuthenticationService } from '../../services';
import { emailValidator } from '../../pipes/index';
import { User, CurrentUser } from '../../Models';
import { Location } from '@angular/common'
import { ResizeOptions, ImageResult } from 'ng2-imageupload';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
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
export class ProfileComponent implements OnInit {
    inFrm: FormGroup;
    currentUser: CurrentUser = this.auth.getUser();
    model: User = new User();
    headerText: string;
    errorMessage: string;
    selectedUser: number;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    zoomedImageSrc

    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 300,
        resizeMaxWidth: 300
    };

    constructor(public serv: UserService,
        private auth: AuthenticationService, private loc: Location,
        private fb: FormBuilder) {
        this.inFrm = fb.group({
            'UserID': null,
            'UserName': [null, Validators.required],
            'JobClass': [null, Validators.required],
            'photo': [null],
            'Email': [null, emailValidator],
            'Phone': null
        })
    }

    ngOnInit() {
        this.headerText = 'User Profile';
        this.serv.getuser(this.currentUser.userID).subscribe(ret => {
            this.model = ret[0];
            let photo, base64String
            if (ret[0].Photo != null) {
                base64String = btoa([].reduce.call(new Uint8Array(ret[0].Photo.data), function (p, c) { return p + String.fromCharCode(c) }, ''))
                photo = "data:image/PNG;base64," + base64String
            } else {
                photo = './assets/img/app/profile/avatar5.png'
            }
            this.model.Photo = photo
            this.inFrm.controls['UserName'].disable()
            this.inFrm.controls['JobClass'].disable()
        });
    }
    HandleForm(event) {
        event.preventDefault();
        var newUser: User = this.model;
        newUser.DirectManager = this.currentUser.userID;
        this.serv.UpdateUser(newUser.UserID, newUser).subscribe(ret => {
            if (ret.error) {
                this.errorMessage = ret.error.message;
            } else if (ret.affected > 0) {
                this.ngOnInit();
            }
        });
    }
    goBack() {
        this.loc.back();
    }

    selected(imageResult: ImageResult) {
        this.zoomedImageSrc = imageResult.dataURL
        this.model.Photo = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
    }
}
