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
            header_en: "Customer Reports",
            header_ar: "تقارير العملاء",
            heading: true
        },
        {
            header_en: "All Customers",
            header_ar: "كل العملاء",
            link: "../allCust"
        },
        {
            header_en: "Customer By Area",
            header_ar: "العملاء بالمنطقة",
            link: "../custarea"
        },
        {
            header_en: "Customer By Country",
            header_ar: "العملاء بالمحافظة",
            link: "../custcntry"
        },
        {
            header_en: "Top Customer By Sales Amount",
            header_ar: "العملاء الاكثر مبيعا",
            link: "../topCust"
        },
        {
            header_en: "Sales Analysis",
            header_ar: "تحليل المبيعات",
            heading: true
        },
        {
            header_en: "Sales By Customer",
            header_ar: "المبيعات بالعميل",
            link: "../slsCust"
        },
        {
            header_en: "Sales By Country",
            header_ar: "المبيعات بالمحافظة",
            link: "../slscntry"
        },
        {
            header_en: "Sales By Area",
            header_ar: "المبيعات بالمنطقة",
            link: "../slsarea"
        },
        {
            header_en: "Top 10 Selling Products",
            header_ar: "أكثر 10 منتجات مبيعا",
            link: "../topProd"
        },
        {
            header_en: "Least 10 Selling Products",
            header_ar: "أقل 10 منتجات مبيعا",
            link: "../lstProd"
        },
        {
            header_en: "Compare with Last Month By Product",
            header_ar: "مقارنة بالشهر الماضي بالمنتجات",
            link: "../cmprMonth"
        },
        {
            header_en: "Sales Summary",
            header_ar: "ملخص المبيعات بفترة",
            link: "../slsSmry"
        },
        {
            header_en: "Sales Income Tracker",
            header_ar: "متابعة الدخل",
            link: "../slsincm"
        },
        {
            header_en: "Finished Store",
            header_ar: "مخزن المنتج النهائي",
            heading: true
        },
        {
            header_en: "Product History",
            header_ar: "تاريخ المنتج",
            link: "../finHst"
        },
        {
            header_en: "Product Receiving / Period",
            header_ar: "الاستلام بفترة",
            link: "../rptfinRec"
        },
        {
            header_en: "Product Dispensing / Period",
            header_ar: "الصرف بفترة",
            link: "../rptfinDisp"
        },
        {
            header_en: "Product Equalization / Period",
            header_ar: "التسوية بفترة",
            link: "../rptfinEqul"
        },
        {
            header_en: "Product Return / Period",
            header_ar: "المرتجعات بفترة",
            link: "../rptfinRet"
        },
        {
            header_en: "Empty Stock Products",
            header_ar: "منتجات بلا رصيد",
            link: "../rptfinEmpty"
        },
    ]
    ngOnInit() { }
}
