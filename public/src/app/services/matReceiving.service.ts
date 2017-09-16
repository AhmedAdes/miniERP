import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { MaterialReceiving, MaterialStoreDetail, DBConStrng } from '../Models';

@Injectable()
export class MatReceivingService {

    constructor(private http: Http, private auth: AuthenticationService) { }

    url = DBConStrng + 'matrec/';
    headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
    options = new RequestOptions({ headers: this.headers });

    getReceiving(id?: number) {
        var geturl = this.url;
        if (id != null) {
            geturl = this.url + id;
        }
        return this.http.get(geturl, this.options).map(res => res.json());
    }

    insertReceiving(rec: MaterialReceiving, det: MaterialStoreDetail[]) {
        return this.http.post(this.url, { master: rec, details: det }, this.options).map(res => res.json());
    }
    updateReceiving(id: number, rec: MaterialReceiving, det: MaterialStoreDetail[]) {
        return this.http.put(this.url + id, { master: rec, details: det }, this.options).map(res => res.json());
    }
    deleteReceiving(id: number) {
        return this.http.delete(this.url + id, this.options).map(res => res.json());
    }

}
