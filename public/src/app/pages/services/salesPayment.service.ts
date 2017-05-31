import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { SalesPayment, DBConStrng } from '../Models/index';

@Injectable()
export class SalesPaymentService {

    constructor(private http: Http, private auth: AuthenticationService) { }

    url = DBConStrng + 'spayment/';
    headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
    options = new RequestOptions({ headers: this.headers });

    getSalesPayment(id?: number) {
        var geturl = this.url;
        if (id != null) {
            geturl = this.url + id;
        }
        return this.http.get(geturl, this.options).map(res => res.json());
    }
    getSalesOrderPayment(id: number) {
        return this.http.get(this.url + 'orderpays/' + id, this.options).map(res => res.json());
    }
    InsertSalesPayments(SOID: number, UserID: number, pays: SalesPayment[]) {
        var promises = [];
        promises.push(this.http.delete(this.url + SOID, this.options).map(res => res.json()));
        pays.forEach(element => {
            element.UserID = UserID;
            element.SOID = SOID;
            promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
        });
        return Observable.forkJoin(promises);
    }

    insertSalesPayment(spay: SalesPayment) {
        return this.http.post(this.url, spay, this.options).map(res => res.json());
    }
    updateSalesPayment(id: number, spay: SalesPayment) {
        return this.http.put(this.url + id, spay, this.options).map(res => res.json());
    }
    deleteSalesPayment(id: number) {
        return this.http.delete(this.url + id, this.options).map(res => res.json());
    }

}
