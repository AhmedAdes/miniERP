import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { ModelSize, DBConStrng } from '../Models';

@Injectable()
export class SizeService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'size/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getSize(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  InsertProdSizes(ModelID: number, UserID: number, sizes: ModelSize[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + ModelID, this.options).map(res => res.json()));
    sizes.forEach(element => {
      element.UserID = UserID;
      element.ModelID = ModelID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }

  insertSize(size: ModelSize) {
    return this.http.post(this.url, size, this.options).map(res => res.json());
  }
  deleteSize(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
