import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { MaterialInspection, DBConStrng } from '../Models';

@Injectable()
export class MatInspectionService {

    constructor(private http: Http, private auth: AuthenticationService) { }

    url = DBConStrng + 'matInsp/';
    headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
    options = new RequestOptions({ headers: this.headers });

    getInspection(id?: number) {
        var geturl = this.url;
        if (id != null) {
            geturl = this.url + id;
        }
        return this.http.get(geturl, this.options).map(res => res.json());
    }

    getPendingReciving() {
        return this.http.get(this.url + 'Pending', this.options).map(res => res.json());
    }

    insertInspection(insp: MaterialInspection) {
        return this.http.post(this.url, insp, this.options).map(res => res.json());
    }
    updateInspection(id: number, insp: MaterialInspection) {
        return this.http.put(this.url + id, insp, this.options).map(res => res.json());
    }
    ReleaseInspection(id: number, insp: MaterialInspection) {
        return this.http.put(this.url + 'Release/' + id, insp, this.options).map(res => res.json());
    }
    deleteInspection(id: number) {
        return this.http.delete(this.url + id, this.options).map(res => res.json());
    }

}
