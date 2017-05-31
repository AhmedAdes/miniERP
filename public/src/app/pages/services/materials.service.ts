import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './index';
import 'rxjs/add/operator/map';
import { Material, DBConStrng } from '../Models/index';

@Injectable()
export class MaterialService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  fabric = DBConStrng + 'fabrics/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getCloth(id?: number) {
    var geturl = this.fabric ;
    if (id != null) {
      geturl = this.fabric + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertMaterial(material: Material) {
    return this.http.post(this.fabric , material, this.options).map(res => res.json());
  }
  updateMaterial(id: number, material: Material) {
    return this.http.put(this.fabric  + id, material, this.options).map(res => res.json());
  }
  deleteMaterial(id: number) {
    return this.http.delete(this.fabric + id, this.options).map(res => res.json());
  }

}
