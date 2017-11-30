import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { FinishedReject, FinishedStoreDetail, DBConStrng } from '../Models';

@Injectable()
export class FinRejectService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'finrej/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getReject(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertReject(rec: FinishedReject, det: FinishedStoreDetail[]) {
    return this.http.post(this.url, { master: rec, details: det }, this.options).map(res => res.json());
  }
  updateReject(id: number, rec: FinishedReject, det: FinishedStoreDetail[]) {
    return this.http.put(this.url + id, { master: rec, details: det }, this.options).map(res => res.json());
  }
  deleteReject(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
