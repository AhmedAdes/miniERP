import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { FinishedTransfer, FinishedStoreDetail, DBConStrng } from '../Models';

@Injectable()
export class FinTransferService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'fintrans/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getTransfer(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertTransfer(rec: FinishedTransfer, det: FinishedStoreDetail[]) {
    return this.http.post(this.url, { master: rec, details: det }, this.options).map(res => res.json());
  }
  updateTransfer(id: number, rec: FinishedTransfer, det: FinishedStoreDetail[]) {
    return this.http.put(this.url + id, { master: rec, details: det }, this.options).map(res => res.json());
  }
  deleteTransfer(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }
  searchModelCode(model: number) {
    return this.http.get(this.url + 'SearchModel/' + model, this.options).map(res => res.json());
  }

}
