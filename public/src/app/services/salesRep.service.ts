import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { SalesRep, SalesRepTarget, DBConStrng } from '../Models';

@Injectable()
export class SalesRepService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'srep/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getSalesRep(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertSalesRep(rep: SalesRep) {
    return this.http.post(this.url, rep, this.options).map(res => res.json());
  }
  updateSalesRep(id: number, rep: SalesRep) {
    return this.http.put(this.url + id, rep, this.options).map(res => res.json());
  }
  deleteSalesRep(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

  getSalesRepPlan(id: number, year: number) {
    return this.http.get(this.url + 'Plan/' + id + '.' + year, this.options).map(res => res.json());
  }
  insertSalesPlan(rep: number, planArr: SalesRepTarget[]) {
    return this.http.post(this.url + 'Plan/', { rep: rep, target: planArr }, this.options).map(res => res.json());
  }
}
