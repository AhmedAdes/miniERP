import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthenticationService } from './auth.service';
import 'rxjs/add/operator/map';
import { SalesHeader, SalesDetail, SalesPayment, DBConStrng } from '../Models';

@Injectable()
export class SalesHeaderService {

  constructor(private http: Http, private auth: AuthenticationService) { }

  url = DBConStrng + 'sheaders/';
  headers = new Headers({ 'Authorization': this.auth.getUser().token, 'Salt': this.auth.getUser().salt });
  options = new RequestOptions({ headers: this.headers });

  getSalesHeader(id?: number) {
    var geturl = this.url;
    if (id != null) {
      geturl = this.url + id;
    }
    return this.http.get(geturl, this.options).map(res => res.json());
  }
  getUnFinishedSalesHeader(id?: number) {
    var geturl = this.url + 'unfinSales/';
    return this.http.get(geturl, this.options).map(res => res.json());
  }
  getFinishedSalesHeader(id?: number) {
    var geturl = this.url + 'finSales/';
    return this.http.get(geturl, this.options).map(res => res.json());
  }
  insertFullSalesHeader(sheader: SalesHeader, sdetail: SalesDetail[], spayment: SalesPayment[]) {
    return this.http.post(this.url, { master: sheader, details: sdetail, payments: spayment }, this.options).map(res => res.json());
  }

  updateFullSalesHeader(id: number, sheader: SalesHeader, sdetail: SalesDetail[], spayment: SalesPayment[]) {
    return this.http.put(this.url + id, { master: sheader, details: sdetail, payments: spayment }, this.options).map(res => res.json());
  }

  deleteSalesHeader(id: number) {
    return this.http.delete(this.url + id, this.options).map(res => res.json());
  }

  getSalesByStoreTypeReport(typeID: number, fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesByStrType/' + typeID + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesByCustReport(custID: number, fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesByCust/' + custID + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesByProductReport(modelID: number, fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesByProduct/' + modelID + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesByProductMonthsReport(modelID: number, fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesByProductMonths/' + modelID + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesByPeriod(group: string, fromdate: string, todate: string) {
    return this.http.get(this.url + 'SalesGroupPeriod/' + group + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesByCntryReport(fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesByCntry/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesByAreaReport(cntry: string, fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesByArea/' + cntry + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSellingCountries() {
    return this.http.get(this.url + 'sellingCntry', this.options).map(res => res.json())
  }
  getTopSellingProd(fType: string, fromdate: string, todate: string) {
    return this.http.get(this.url + 'TsellProdQty/' + fType + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getLeastSellingProd(fType: string, fromdate: string, todate: string) {
    return this.http.get(this.url + 'LsellProdQty/' + fType + '.' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getCompareSales(Month1: number, Year1: number, Month2: number, Year2: number) {
    return this.http.get(this.url + 'compareSales/' + Month1 + '.' + Year1 + '.' + Month2 + '.' + Year2, this.options).map(res => res.json())
  }
  getSalesSummary(fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesSummary/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getSalesSummaryChart(fromdate: string, todate: string) {
    return this.http.get(this.url + 'salesSummaryChrt/' + fromdate + '.' + todate, this.options).map(res => res.json())
  }
  getIncomeTracker() {
    return this.http.get(this.url + 'incomeTracker/', this.options).map(res => res.json())
  }
  getUnpaidInvoices() {
    return this.http.get(this.url + 'unpaidInvoices/', this.options).map(res => res.json())
  }
  getOverdueInvoices() {
    return this.http.get(this.url + 'overDueInvoices/', this.options).map(res => res.json())
  }
  getPaidInvoices() {
    return this.http.get(this.url + 'paidInvoices/', this.options).map(res => res.json())
  }
  getSalesModels(soid: number) {
    return this.http.get(this.url + 'SlsHdModels/' + soid, this.options).map(res => res.json())
  }
  getSalesColor(modelID, soid: number) {
    return this.http.get(this.url + 'SlsHdColors/' + modelID + '.' + soid, this.options).map(res => res.json())
  }
}
