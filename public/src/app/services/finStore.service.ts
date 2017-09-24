import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { FinishedStore, DBConStrng } from '../Models';

@Injectable()
export class FinStoreService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'finstore/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getStoreBalance() {
    return this.http.get(this.url, this.options).map(res => res.json());
  }

  getProdHistory(modelID: number, clrID?: number) {
    if (clrID != null) {
      return this.http.get(this.url + 'ProdHistoryClr/' + clrID, this.options).map(res => res.json());
    } else {
      return this.http.get(this.url + 'ProdHistoryMod/' + modelID, this.options).map(res => res.json());
    }
  }

  getReceivingPeriod(fromdate: string, todate: string) {
    return this.http.get(this.url + 'ReceiveByPeriod/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getDispensePeriod(fromdate: string, todate: string) {
    return this.http.get(this.url + 'DispenseByPeriod/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getEqualizePeriod(fromdate: string, todate: string) {
    return this.http.get(this.url + 'EqualizeByPeriod/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getReturnPeriod(fromdate: string, todate: string) {
    return this.http.get(this.url + 'ReturnByPeriod/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getEmptyStock() {
    return this.http.get(this.url + 'EmptyStock/all' , this.options).map(res => res.json())
  }
}
