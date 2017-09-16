import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { FinishedDispensing, FinishedStoreDetail, DBConStrng } from '../Models';

@Injectable()
export class FinDispensingService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'findisp/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getDispensing(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertDispensing(rec: FinishedDispensing, det: FinishedStoreDetail[]) {
    return this.http.post(this.url, { master: rec, details: det }, this.options).map(res => res.json());
  }
  updateDispensing(id: number, rec: FinishedDispensing, det: FinishedStoreDetail[]) {
    return this.http.put(this.url + id, { master: rec, details: det }, this.options).map(res => res.json());
  }
  deleteDispensing(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
