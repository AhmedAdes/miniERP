import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'rpt-home',
    templateUrl: './rptHome.component.html'
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
            header: "Customer By Sales Amount",
            link: "/reports/custamnt"
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
            header: "Sales By Amount",
            link: "/reports/slsamnt"
        }
    ]
    ngOnInit() { }
}