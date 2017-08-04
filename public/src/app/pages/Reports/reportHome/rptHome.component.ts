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
            link: "/reports/custarea"
        },
        {
            header: "Customer By Country",
            link: "/reports/custcntry"
        }, 
        {
            header: "Top Customer By Sales Amount",
            link: "/reports/topCust"
        }, 
        {
            header: "Sales Analysis",
            heading: true
        },
        {
            header: "Sales By Customer",
            link: "/reports/slsCust"
        }, 
        {
            header: "Sales By Country",
            link: "/reports/slscntry"
        }, 
        {
            header: "Sales By Area",
            link: "/reports/slsarea"
        }, 
        {
            header: "Top 10 Selling Products",
            link: "/reports/topProd"
        }, 
        {
            header: "Least 10 Selling Products",
            link: "/reports/lstProd"
        }, 
        {
            header: "Compare with Last Month By Product",
            link: "/reports/cmprMonth"
        }, 
        {
            header: "Sales Summary",
            link: "/reports/slsSmry"
        }
    ]
    ngOnInit() { }
}