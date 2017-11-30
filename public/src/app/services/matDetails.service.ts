import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { MaterialStoreDetail, DBConStrng, MaterialReceiving } from '../Models';

@Injectable()
export class MatDetailService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'matdet/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getMatRecDetail(id: number) {
    return this.http.get(this.url + 'Receiving/' + id, this.options).map(res => res.json());
  }
  getMatDispDetail(id: number) {
    return this.http.get(this.url + 'Dispensing/' + id, this.options).map(res => res.json());
  }
  getMatEqualDetail(id: number) {
    return this.http.get(this.url + 'Equalize/' + id, this.options).map(res => res.json());
  }
  getMatRetDetail(id: number) {
    return this.http.get(this.url + 'Return/' + id, this.options).map(res => res.json());
  }
  getMatRejectDetail(id: number) {
    return this.http.get(this.url + 'Reject/' + id, this.options).map(res => res.json());
  }

  getMatStock(clrid: number) {
    return this.http.get(this.url + 'ClrStock/' + clrid, this.options).map(res => res.json());
  }

}
