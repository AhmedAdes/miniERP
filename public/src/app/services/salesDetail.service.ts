import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { SalesDetail, DBConStrng } from '../Models';

@Injectable()
export class SalesDetailService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'sdetail/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getSalesDetail(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }
  getSalesFinishDetail(soid) {
    return this.http.get(this.url + 'salesFinDet/' + soid, this.options).map(res => res.json());
  }
  
  InsertSalesDetails(SOID: number, UserID: number, clrs: SalesDetail[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + SOID, this.options).map(res => res.json()));
    clrs.forEach(element => {
      element.UserID = UserID;
      element.SOID = SOID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }

  insertSalesDetail(sdetail: SalesDetail) {
    return this.http.post(this.url, sdetail, this.options).map(res => res.json());
  }
  deleteSalesDetail(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
