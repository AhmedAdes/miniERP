import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User, CurrentUser, CurrentLoggedUser, JobClass, DBConStrng } from '../Models';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    private token: string;
    private salt: string;
    private currentUser: CurrentUser;

    url = DBConStrng + 'authenticate';

    constructor(private http: Http) {
        // set token if saved in local storage
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.currentUser && this.currentUser.token;
        this.salt = this.currentUser && this.currentUser.salt;
    }

    login(user: any) {
        return this.http.post(this.url, user)
            .map((response: Response) => {
                const arrRet = response.json();
                console.log(arrRet)
                if (arrRet.error) {
                    return { login: false, error: arrRet.error }
                } else if (arrRet.Approved == false) {
                    return { login: false, error: 'this user is not approved yet please wait for the activation.' }
                }

                // login successful if there's a jwt token in the response
                let token = arrRet.tkn;
                if (token) {
                    // set token property
                    this.token = token;
                    let base64String
                    let photo

                    if (arrRet.user[0].Photo != null) {
                        base64String = btoa([].reduce.call(new Uint8Array(arrRet.user[0].Photo.data), function (p, c) { return p + String.fromCharCode(c) }, ''))
                        photo = "data:image/PNG;base64," + base64String
                    } else {
                        photo = './assets/img/app/profile/avatar5.png'
                    }
                    this.currentUser = {
                        userID: arrRet.user[0].UserID, userName: arrRet.user[0].UserName, photo: photo,
                        jobClass: this.getClass(arrRet.user[0].JobClass), salt: arrRet.salt, token: token
                    }

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                    // return true to indicate successful login
                    return { login: true, error: null };
                } else {
                    // return false to indicate failed login
                    return { login: false, error: 'Username or password is incorrect' };
                }
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        this.salt = null;
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getClass(job: string): number {
      let Jobs = JobClass
      let ret = Jobs.filter(obj => obj.name == job)[0].class;
      return ret;
    }

    getUser(): CurrentUser {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this.currentUser;
    }
}
