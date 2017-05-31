import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './index';
import 'rxjs/add/operator/map';
import { Material, DBConStrng } from '../Models/index';

@Injectable()
export class AccessoryService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  accessory = DBConStrng + 'Accessories/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getAccessory(id?: number) {
    var geturl = this.accessory ;
    if (id != null) {
      geturl = this.accessory + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertMaterial(material: Material) {
    return this.http.post(this.accessory , material, this.options).map(res => res.json());
  }
  updateMaterial(id: number, material: Material) {
    return this.http.put(this.accessory  + id, material, this.options).map(res => res.json());
  }
  deleteMaterial(id: number) {
    return this.http.delete(this.accessory + id, this.options).map(res => res.json());
  }

}
