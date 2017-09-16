import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Model, ModelColor, ModelSize, DBConStrng } from '../Models';

@Injectable()
export class ModelService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'models/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getModel(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertModel(model: Model, clrs: ModelColor[], sizs: ModelSize[]) {
    return this.http.post(this.url, { model: model, clrs: clrs, sizes: sizs }, this.options).map(res => res.json());
  }
  updateModel(id: number, model: Model, clrs: ModelColor[], sizs: ModelSize[]) {
    return this.http.put(this.url + id, { model: model, clrs: clrs, sizes: sizs }, this.options).map(res => res.json());
  }
  deleteModel(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
