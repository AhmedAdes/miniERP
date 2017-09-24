import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rpt-home',
    templateUrl: './rptHome.component.html',
    styles: [`.text-center{
       text-align: center; 
    }`]
})
export class ReportHomeComponent implements OnInit {
    constructor() { }
    reports: Array<any> = [
        {
            header: "Customer Reports",
            heading: true
        },
        {
            header: "Customer By Area",
            link: "../custarea"
        },
        {
            header: "Customer By Country",
            link: "../custcntry"
        }, 
        {
            header: "Top Customer By Sales Amount",
            link: "../topCust"
        }, 
        {
            header: "Sales Analysis",
            heading: true
        },
        {
            header: "Sales By Customer",
            link: "../slsCust"
        }, 
        {
            header: "Sales By Country",
            link: "../slscntry"
        }, 
        {
            header: "Sales By Area",
            link: "../slsarea"
        }, 
        {
            header: "Top 10 Selling Products",
            link: "../topProd"
        }, 
        {
            header: "Least 10 Selling Products",
            link: "../lstProd"
        }, 
        {
            header: "Compare with Last Month By Product",
            link: "../cmprMonth"
        }, 
        {
            header: "Sales Summary",
            link: "../slsSmry"
        }, 
        {
            header: "Sales Income Tracker",
            link: "../slsincm"
        }, 
        {
            header: "Finished Store",
            heading: true
        },
        {
            header: "Product History",
            link: "../finHst"
        },
        {
            header: "Product Receiving / Period",
            link: "../rptfinRec"
        },
        {
            header: "Product Dispensing / Period",
            link: "../rptfinDisp"
        },
        {
            header: "Product Equalization / Period",
            link: "../rptfinEqul"
        },
        {
            header: "Product Return / Period",
            link: "../rptfinRet"
        },
        {
            header: "Empty Stock Products",
            link: "../rptfinEmpty"
        }, 
    ]
    ngOnInit() { }
}