import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { MaterialReturn, MaterialStoreDetail, DBConStrng } from '../Models/index';

@Injectable()
export class MatReturnService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'matret/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getReturn(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertReturn(rec: MaterialReturn, det: MaterialStoreDetail[]) {
    return this.http.post(this.url, { master: rec, details: det }, this.options).map(res => res.json());
  }
  updateReturn(id: number, rec: MaterialReturn, det: MaterialStoreDetail[]) {
    return this.http.put(this.url + id, { master: rec, details: det }, this.options).map(res => res.json());
  }
  deleteReturn(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
