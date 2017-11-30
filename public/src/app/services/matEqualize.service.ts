import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { MaterialEqualization, MaterialStoreDetail, DBConStrng } from '../Models';

@Injectable()
export class MatEqualizeService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'matequl/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getEqualize(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertEqualize(rec: MaterialEqualization, det: MaterialStoreDetail[]) {
    return this.http.post(this.url, { master: rec, details: det }, this.options).map(res => res.json());
  }
  updateEqualize(id: number, rec: MaterialEqualization, det: MaterialStoreDetail[]) {
    return this.http.put(this.url + id, { master: rec, details: det }, this.options).map(res => res.json());
  }
  deleteEqualize(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
