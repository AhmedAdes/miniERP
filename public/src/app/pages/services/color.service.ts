import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { ModelColor, DBConStrng } from '../Models/index';

@Injectable()
export class ColorService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'color/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getColor(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  InsertProdColors(ModelID: number,UserID: number,clrs: ModelColor[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + ModelID, this.options).map(res => res.json()));
    clrs.forEach(element => {
      element.UserID = UserID;
      element.ModelID = ModelID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }

  insertColor(color: ModelColor) {
    return this.http.post(this.url, color, this.options).map(res => res.json());
  }
  deleteColor(id: string) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
