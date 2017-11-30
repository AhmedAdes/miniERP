import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Brand, DBConStrng } from '../Models';

@Injectable()
export class BrandService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'brands/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getBrand(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertBrand(brand: Brand) {
    return this.http.post(this.url, brand, this.options).map(res => res.json());
  }
  updateBrand(id: string, brand: Brand) {
    return this.http.put(this.url + id, brand, this.options).map(res => res.json());
  }
  deleteBrand(id: string) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
