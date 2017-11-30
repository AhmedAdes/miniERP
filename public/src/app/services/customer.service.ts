import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { Customer, DBConStrng } from '../Models';

@Injectable()
export class CustomerService {

    constructor(private http: Http, private auth: AuthenticationService) { }

    url = DBConStrng + 'customer/';
    headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
    options = new RequestOptions({ headers: this.headers });

    getCustomer(id?: number) {
        var geturl = this.url;
        if (id != null) {
            geturl = this.url + id;
        }
        return this.http.get(geturl, this.options).map(res => res.json());
    }
    getCustomerforUser(id: number) {
        return this.http.get(this.url + 'UserCustomers/' + id, this.options).map(res => res.json());
    }

    insertCustomer(customer: Customer) {
        return this.http.post(this.url, customer, this.options).map(res => res.json());
    }
    updateCustomer(id: number, customer: Customer) {
        return this.http.put(this.url + id, customer, this.options).map(res => res.json());
    }
    deleteCustomer(id: number) {
        return this.http.delete(this.url + id, this.options).map(res => res.json());
    }

    getCustomerByCountry() {
        return this.http.get(this.url + 'ByCountry', this.options).map(res => res.json());
    }
    getCustomerByArea() {
        return this.http.get(this.url + 'ByArea', this.options).map(res => res.json());
    }
    getCustomerByPeriod(fromDate: string, toDate: string) {
        return this.http.get(this.url + 'ByPeriod/' + fromDate + '.' + toDate, this.options).map(res => res.json());
    }
    getTopCustomers(fromDate: string, toDate: string) {
        return this.http.get(this.url + 'topCust/' + fromDate + '.' + toDate, this.options).map(res => res.json())
    }
    getSalesCustomers() {
        return this.http.get(this.url + 'SalesCusts', this.options).map(res => res.json());
    }
    getRepNewCustomer(id: number, fromDate: string, toDate: string) {
        return this.http.get(this.url + 'repNewCusts/' + id + '.' + fromDate + '.' + toDate, this.options).map(res => res.json());
    }

}
