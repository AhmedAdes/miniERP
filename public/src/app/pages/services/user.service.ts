import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { User, DBConStrng } from '../Models/index';

@Injectable()
export class UserService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'users/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getuser(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options)
      .map(res => res.json());
  }

  InsertUser(user: User) {
    return this.http.post(this.url , user, this.options).map(res => res.json());
  }

  UpdateUser(id: number, user: User) {
    return this.http.put(this.url + id, user, this.options).map(res => res.json());
  }

  DeleteUser(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

  ApproveUser(id: number, ApproveUser: number) {
    this.options.headers.append("Content-type", "application/json");
    return this.http.put(this.url + 'Approve/' + id, JSON.stringify({id: id, appuser: ApproveUser}), this.options).map(res => res.json());
  }
}
