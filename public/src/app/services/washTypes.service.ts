import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { WashType, DBConStrng } from '../Models';

@Injectable()
export class WashTypeService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'wash/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getWashType(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertWashType(wash: WashType) {
    return this.http.post(this.url, wash, this.options).map(res => res.json());
  }
  updateWashType(id: number, wash: WashType) {
    return this.http.put(this.url + id, wash, this.options).map(res => res.json());
  }
  deleteWashType(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
