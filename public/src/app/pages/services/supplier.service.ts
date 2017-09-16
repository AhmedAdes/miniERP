import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Supplier, DBConStrng } from '../Models/index';

@Injectable()
export class SupplierService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'supplier/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getSupplier(id?: number) {
    var geturl = this.url ;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertSupplier(supplier: Supplier) {
    return this.http.post(this.url , supplier, this.options).map(res => res.json());
  }
  updateSupplier(id: number, supplier: Supplier) {
    return this.http.put(this.url  + id, supplier, this.options).map(res => res.json());
  }
  deleteSupplier(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
