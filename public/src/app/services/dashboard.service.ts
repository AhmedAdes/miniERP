import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { DBConStrng } from '../Models';

@Injectable()
export class DashboardService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'dash/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getCounts() {
    return this.http.get(this.url, this.options).map(res => res.json());
  }
}