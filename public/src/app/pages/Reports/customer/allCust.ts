import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { Location } from '@angular/common'
import { CustomerService } from '../../../services';
import { Customer, CustTypes } from '../../../Models'

@Component({
  selector: 'rpt-allcust',
  templateUrl: './allCust.html',
  styleUrls: ['../../../Styles/PrintPortrait.css']
})
export class RptAllCustomersComponent implements OnInit {
  constructor(public serv: CustomerService, private loc: Location) { }

  collection: Customer[] = [];
  srchObj: Customer = new Customer();
  reportHeader: string
  subHeader: string
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";
  CustTypeList = CustTypes;

  ngOnInit() {
    this.ViewReport()
  }

  ViewReport() {
    this.srchObj = new Customer()
    this.serv.getCustomer().subscribe(cols => this.collection = cols);
  }

  SortTable(column: string) {
    if (this.orderbyString.indexOf(column) == -1) {
      this.orderbyClass = "fa fa-sort-amount-asc";
      this.orderbyString = '+' + column;
    } else if (this.orderbyString.indexOf('-' + column) == -1) {
      this.orderbyClass = "fa fa-sort-amount-desc";
      this.orderbyString = '-' + column;
    } else {
      this.orderbyClass = 'fa fa-sort';
      this.orderbyString = '';
    }
  }
  AfterViewInit() {
    // window.setTimeout(function () { window.print(); }, 500);
    // window.onfocus = function () { setTimeout(function () { window.close(); }, 500); }
  }
  goBack() {
    this.loc.back();
  }
  printReport() {
    window.print();
  }
}
