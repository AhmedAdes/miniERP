import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Region, DBConStrng } from '../Models';

@Injectable()
export class RegionService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'region/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getRegion(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }

  insertRegion(region: Region) {
    return this.http.post(this.url, region, this.options).map(res => res.json());
  }
  updateRegion(id: number, region: Region) {
    return this.http.put(this.url + id, region, this.options).map(res => res.json());
  }
  deleteRegion(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
