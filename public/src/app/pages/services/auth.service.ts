import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { User, CurrentUser, CurrentLoggedUser ,JobClass, DBConStrng } from '../Models/index';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;
    public currentUser: CurrentUser;

    url = DBConStrng + 'authenticate';

    constructor(private http: Http) {
        // set token if saved in local storage
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = this.currentUser && this.currentUser.token;
    }

    login(user: any) {
        return this.http.post(this.url, user)
            .map((response: Response) => {

                var arrRet = response.json()[0];

                if (arrRet[0].error) {
                    return { login: false, error: arrRet[0].error }
                } else if (arrRet[0].Approved == false) {
                    return { login: false, error: 'this user is not approved yet please wait for the activation.' }
                }

                // login successful if there's a jwt token in the response
                let token = arrRet[0] && arrRet[0].token;
                if (token) {
                    // set token property
                    this.token = token;

                    this.currentUser = { userID: arrRet[0].UserID, userName: arrRet[0].UserName, photo: arrRet[0].Photo, isAdmin: arrRet[0].isAdmin, token: token }

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
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    getUser(): CurrentUser {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return this.currentUser;
    }
}