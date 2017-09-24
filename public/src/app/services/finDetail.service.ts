import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/forkJoin';
import { Observable } from 'rxjs/Observable';
import { FinishedStoreDetail, DBConStrng, FinishedReceiving } from '../Models';

@Injectable()
export class FinDetailService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'fdetail/';
  headers = new Headers({ 'Authorization': 'Bearer ' + this.auth.token });
  options = new RequestOptions({ headers: this.headers });

  getFinRecDetail(id: number) {    
    return this.http.get(this.url + 'Receiving/' + id, this.options).map(res => res.json());
  }
  getFinDispDetail(id: number) {    
    return this.http.get(this.url + 'Dispensing/' + id, this.options).map(res => res.json());
  }
  getFinEqualDetail(id: number) {    
    return this.http.get(this.url + 'Equalize/' + id, this.options).map(res => res.json());
  }
  getFinRetDetail(id: number) {    
    return this.http.get(this.url + 'Return/' + id, this.options).map(res => res.json());
  }
  getFinRejectDetail(id: number) {    
    return this.http.get(this.url + 'Reject/' + id, this.options).map(res => res.json());
  }

  getFinStock(clrid: number){
    return this.http.get(this.url + 'ClrStock/' + clrid, this.options).map(res => res.json());
  }  
  getFinStockwithOrders(clrid: number){
    return this.http.get(this.url + 'ClrStockWOrders/' + clrid, this.options).map(res => res.json());
  }

  InsertFinRecDetails(rec: FinishedReceiving,UserID: number,fdetail: FinishedStoreDetail[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + 'Receiving/' + rec.FinReceivingID, this.options).map(res => res.json()));
    fdetail.forEach(element => {
      element.UserID = UserID;
      element.FinReceivingID = rec.FinReceivingID;
      element.BatchNo = rec.BatchNo;
      element.SerialNo = rec.SerialNo;
      element.RecYear = rec.RecYear;
      
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }

  InsertFinDispDetails(FinDispensingID: number,UserID: number,fdetail: FinishedStoreDetail[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + 'Dispensing/' + FinDispensingID, this.options).map(res => res.json()));
    fdetail.forEach(element => {
      element.UserID = UserID;
      element.FinDispensingID = FinDispensingID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }
  
  InsertFinEqualDetails(FinEqualizeID: number,UserID: number,fdetail: FinishedStoreDetail[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + 'Equalize/' + FinEqualizeID, this.options).map(res => res.json()));
    fdetail.forEach(element => {
      element.UserID = UserID;
      element.FinEqualizeID = FinEqualizeID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }
  
  InsertFinRetDetails(FinReturnID: number,UserID: number,fdetail: FinishedStoreDetail[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + 'Return/' + FinReturnID, this.options).map(res => res.json()));
    fdetail.forEach(element => {
      element.UserID = UserID;
      element.FinReturnID = FinReturnID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }
  
  InsertFinRejectDetails(FinRejectID: number,UserID: number,fdetail: FinishedStoreDetail[]) {
    var promises = [];
    promises.push(this.http.delete(this.url + 'Reject/' + FinRejectID, this.options).map(res => res.json()));
    fdetail.forEach(element => {
      element.UserID = UserID;
      element.FinRejectID = FinRejectID;
      promises.push(this.http.post(this.url, element, this.options).map(res => res.json()));
    });
    return Observable.forkJoin(promises);
  }
  
  insertFinDetail(fdetail: FinishedStoreDetail) {
    return this.http.post(this.url, fdetail, this.options).map(res => res.json());
  }
  deleteFinDetail(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

}
