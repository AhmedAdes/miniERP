import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Province, DBConStrng } from '../Models';

@Injectable()
export class ProvinceService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'provnc/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getProvince(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertProvince(prov: Province) {
    return this.http.post(this.url, prov, this.options).map(res => res.json());
  }
  updateProvince(id: number, prov: Province) {
    return this.http.put(this.url + id, prov, this.options).map(res => res.json());
  }
  deleteProvince(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
