import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { SalesRep, DBConStrng } from '../Models/index';

@Injectable()
export class SalesRepService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'srep/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getSalesRep(id?: number) {
    var geturl = this.url ;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertSalesRep(rep: SalesRep) {
    return this.http.post(this.url , rep, this.options).map(res => res.json());
  }
  updateSalesRep(id: number, rep: SalesRep) {
    return this.http.put(this.url  + id, rep, this.options).map(res => res.json());
  }
  deleteSalesRep(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
