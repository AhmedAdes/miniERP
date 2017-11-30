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
            header_en: "All Customers",
            header_ar: "كل العملاء",
            link: "../allCust",
            group: 1
        },
        {
            header_en: "Rep. New Customers",
            header_ar: "العملاء الجدد",
            link: "../repNewCust",
            group: 1
        },
        {
            header_en: "Customer By Area",
            header_ar: "العملاء بالمنطقة",
            link: "../custarea",
            group: 1
        },
        {
            header_en: "Customer By Country",
            header_ar: "العملاء بالمحافظة",
            link: "../custcntry",
            group: 1
        },
        {
            header_en: "Top Customer By Sales Amount",
            header_ar: "العملاء الاكثر مبيعا",
            link: "../topCust",
            group: 1
        },
        {
            header_en: "Sales By Period",
            header_ar: "المبيعات في فترة",
            link: "../slsGrp",
            group: 2
        },
        {
            header_en: "Sales By Customer",
            header_ar: "المبيعات بالعميل",
            link: "../slsCust",
            group: 2
        },
        {
            header_en: "Sales By Product",
            header_ar: "المبيعات بالمنتج",
            link: "../slsProd",
            group: 2
        },
        {
            header_en: "Sales By Store Type",
            header_ar: "المبيعات بنوع المخزن",
            link: "../slsStr",
            group: 2
        },
        {
            header_en: "Sales By Country",
            header_ar: "المبيعات بالمحافظة",
            link: "../slscntry",
            group: 2
        },
        {
            header_en: "Sales By Area",
            header_ar: "المبيعات بالمنطقة",
            link: "../slsarea",
            group: 2
        },
        {
            header_en: "Top 10 Selling Products",
            header_ar: "أكثر 10 منتجات مبيعا",
            link: "../topProd",
            group: 2
        },
        {
            header_en: "Least 10 Selling Products",
            header_ar: "أقل 10 منتجات مبيعا",
            link: "../lstProd",
            group: 2
        },
        {
            header_en: "Compare with Last Month By Product",
            header_ar: "مقارنة بالشهر الماضي بالمنتجات",
            link: "../cmprMonth",
            group: 2
        },
        {
            header_en: "Sales Summary",
            header_ar: "ملخص المبيعات بفترة",
            link: "../slsSmry",
            group: 2
        },
        {
            header_en: "Sales Income Tracker",
            header_ar: "متابعة الدخل",
            link: "../slsincm",
            group: 2
        },
        {
            header_en: "Store Balance in Date",
            header_ar: "رصيد المخزن في يوم محدد",
            link: "../blncDate",
            group: 3
        },
        {
            header_en: "Product History",
            header_ar: "تاريخ المنتج",
            link: "../finHst",
            group: 3
        },
        {
            header_en: "Product Receiving / Period",
            header_ar: "الاستلام بفترة",
            link: "../rptfinRec",
            group: 3
        },
        {
            header_en: "Product Dispensing / Period",
            header_ar: "الصرف بفترة",
            link: "../rptfinDisp",
            group: 3
        },
        {
            header_en: "Product Equalization / Period",
            header_ar: "التسوية بفترة",
            link: "../rptfinEqul",
            group: 3
        },
        {
            header_en: "Product Return / Period",
            header_ar: "المرتجعات بفترة",
            link: "../rptfinRet",
            group: 3
        },
        {
            header_en: "Empty Stock Products",
            header_ar: "منتجات بلا رصيد",
            link: "../rptfinEmpty",
            group: 3
        },
    ]
    headings: Array<any> = [
        {
            header_en: "Customer Reports",
            header_ar: "تقارير العملاء",
            heading: true,
            group: 1
        },
        {
            header_en: "Sales Analysis",
            header_ar: "تحليل المبيعات",
            heading: true,
            group: 2
        },
        {
            header_en: "Finished Store",
            header_ar: "مخزن المنتج النهائي",
            heading: true,
            group: 3
        },
    ]
    ngOnInit() { }
}
