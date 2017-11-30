import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Expanses, DBConStrng } from '../Models';

@Injectable()
export class ExpansesService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'expnse/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getExpanses(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertExpanses(expns: Expanses) {
    return this.http.post(this.url, expns, this.options).map(res => res.json());
  }
  updateExpanses(id: number, expns: Expanses) {
    return this.http.put(this.url + id, expns, this.options).map(res => res.json());
  }
  deleteExpanses(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
