import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './index';
import 'rxjs/add/operator/map';
import { SalesHeader, SalesDetail, SalesPayment, DBConStrng } from '../Models/index';

@Injectable()
export class SalesHeaderService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'sheaders/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getSalesHeader(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }
  getUnFinishedSalesHeader(id?: number) {
    var geturl = this.url + 'ers/';    
    return this.http.get(geturl, this.options).map(res => res.json());
  }
  insertFullSalesHeader(sheader: SalesHeader, sdetail: SalesDetail[], spayment: SalesPayment[]) {
    return this.http.post(this.url, { master: sheader, details: sdetail, payments: spayment }, this.options).map(res => res.json());
  }

  updateFullSalesHeader(id: number, sheader: SalesHeader, sdetail: SalesDetail[], spayment: SalesPayment[]) {
    return this.http.put(this.url + id, { master: sheader, details: sdetail, payments: spayment }, this.options).map(res => res.json());
  }

  deleteSalesHeader(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
