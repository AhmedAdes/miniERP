export class SalesHeader {
    SOID: number;
    SODate: Date;
    CustID: number;
    CustName: string;
    ContactPerson: string;
    SalesTax: number;
    Discount: number;
    DiscountPrcnt: boolean;
    Notes: string;
    SelfNotes: string;
    DeliveryDate: Date;
    Commisioner: string;
    CommisionerTel: string;
    GrandTotal: number;
    SumQty: number;
    DeliveryType: string;
    PayMethod: string;
    SalesRepID: number;
    SalesPerson: string;
    UserID: number;
    UserName: string;
    haveReturn: boolean;

    DisplayNames = {
        SOID: { Disp: "Sales Order امرالبيع" },
        SODate: { Disp: "Sales Date التاريخ" },
        CustID: { Disp: "Customer العميل" },
        CustName: { Disp: "Customer العميل" },
        ContactPerson: { Disp: "Contact Person المسئول" },
        SalesTax: { Disp: "SalesTax % ضريبة المبيعات" },
        Discount: { Disp: "Discount % الخصم" },
        Notes: { Disp: "Customer Notes ملاحظات للعميل" },
        SelfNotes: { Disp: "Self Notes ملاحظات لنا" },
        DeliveryDate: { Disp: "Delivery Date تاريخ التسليم" },
        Commisioner: { Disp: "Sales Rep. مندوب البيع" },
        CommisionerTel: { Disp: "Sales Rep. Tel. تليفون مندوب البيع" },
        GrandTotal: { Disp: "Grand Total المبلغ الاجمالي" },
        SumQty: { Disp: "Total Quantity اجمالي الكمية" },
        DeliveryType: { Disp: "Delivery Type طريقة التسليم" },
        PayMethod: { Disp: "Payment Method طريقة الدفع" },
        SalesPerson: { Disp: "Sales Rep. مندوب البيع" },
        UserName: { Disp: "User Name" }
    }
}
export class SalesDetail {
    SODetID: number;
    SOID: number;
    Quantity: number;
    Price: number;
    ColorID: number;
    ColorName: string;
    ModelID: number;
    ModelCode: string;
    ModelName: string;
    UserID: number;
    UserName: string;
    Stock: string;
    StoreType: string;
    StoreTypeID: number;
    SODate: Date;
    CustID: number;
    CustName: string;
    ContactPerson: string;

    DisplayNames = {
        SOID: { Disp: "Sales Order امرالبيع" },
        Quantity: { Disp: "Quantity الكمية" },
        Price: { Disp: "Price السعر" },
        ColorID: { Disp: "Color اللون" },
        ColorName: { Disp: "Color اللون" },
        ModelID: { Disp: "Model الموديل" },
        ModelName: { Disp: "Model الموديل" },
        ModelCode: { Disp: "Model Code كود الموديل" },
        UserName: { Disp: "User Name" },
        Stock: { Disp: "Store Stock رصيد المخزن" },
        StoreType: { Disp: "Store Type نوع مخزن المنتج" },
        SODate: { Disp: "Sales Date التاريخ" },
        CustID: { Disp: "Customer العميل" },
        CustName: { Disp: "Customer العميل" },
        ContactPerson: { Disp: "Contact Person المسئول" },
    }
}
export class SalesPayment {
    SOPayID: number;
    SOID: number;
    PaymentDate: Date;
    PayAmount: number;
    CommisionPaymentDate: Date;
    CommisionAmount: number;
    Paid: boolean;
    CommsionPaid: boolean;
    PayNoteNo: string;
    ReceivePaymentDate: Date;
    CommPayDate: Date;
    UserID: number;
    UserName: string;
    SODate: Date;
    CustName: string;
    SalesRepID: number;
    SalesPerson: string;

    DisplayNames = {
        SOID: { Disp: "Sales Order امرالبيع" },
        PaymentDate: { Disp: "Payment Date تاريخ الدفع" },
        PayAmount: { Disp: "Amount المبلغ" },
        CommisionPaymentDate: { Disp: "Commision Payment Date تاريخ العمولة" },
        CommisionAmount: { Disp: "Commision Amount مبلغ العمولة" },
        Paid: { Disp: "Paid تم الدفع" },
        CommsionPaid: { Disp: "Commsion Paid تم دفع العمولة" },
        PayNoteNo: { Disp: "Note No رقم ايصال الدفع" },
        ReceivePaymentDate: { Disp: "Receive Payment Date تاريخ استلام الدفعة" },
        CommPayDate: { Disp: "Commission Payment Date تاريخ دفع العمولة" },
        UserName: { Disp: "User Name" },
        SODate: { Disp: "Sales Date التاريخ" },
        SalesPerson: { Disp: "Sales Person مندوب البيع" },
        SalesRepID: { Disp: "Person Code كود المندوب" },
        CustName: { Disp: "Customer اسم العميل" }
    }
}
export class SalesRep {
    SalesRepID: number;
    SalesPerson: string;
    Tel: string;

    DisplayNames = {
        SalesRepID: { Disp: "Person Code كود المندوب" },
        SalesPerson: { Disp: "Sales Person مندوب البيع" },
        Tel: { Disp: "Tel التليفون" }
    }
}
export class SalesRepTarget {
    SalesRepID: number;
    SalesPerson: string;
    TargetID: number;
    TargetYear: number;
    TargetMonth: number;
    MonthName: string;
    MonthQty: number;

    DisplayNames = {
        SalesRepID: { Disp: "Person Code كود المندوب" },
        SalesPerson: { Disp: "Sales Person مندوب البيع" },
        TargetID: { Disp: "Target المطلوب" },
        TargetYear: { Disp: "Year السنة" },
        TargetMonth: { Disp: "Month الشهر" },
        MonthName: { Disp: "Month الشهر" },
        MonthQty: { Disp: "Target Qty كمية المطلوب" }
    }
}
export class rptSalesByCust {
    CustID: number;
    CustName: string;
    ColorID: number;
    ModelCode: string;
    ModelName: string;
    Quantity: number;
    UnitPrice: number;
    Discount: number;
    SubTotal: number;
    SODate: Date;
    SOID: number;
    DiscountPrcnt: boolean;
}
export class rptSalesByProd {
    CustID: number;
    CustName: string;
    Region: string;
    ColorID: number;
    ModelCode: string;
    ModelName: string;
    Quantity: number;
    UnitPrice: number;
    Discount: number;
    SubTotal: number;
    SODate: Date;
    SOID: number;
    DiscountPrcnt: boolean;
}
export class rptCompareSales {
    ModelCode: string;
    ModelName: string;
    M1Quantity: number;
    M1Amount: number;
    M2Quantity: number;
    M2Amount: number;
}

export class rptSalesPeriod {
    CustID: number;
    CustName: string;
    Region: string;
    Country: string;
    ColorID: number;
    ModelCode: string;
    ModelName: string;
    Quantity: number;
    UnitPrice: number;
    Discount: number;
    SubTotal: number;
    SODate: Date;
    SOID: number;
    DiscountPrcnt: boolean;
    StoreTypeID: number;
    StoreType: string;
    TOTDiscount: number;
    SalesCount: number;
    CustCount: number;
}
// h.CustID, c.CustName, d.ColorID, m.ModelName, d.Quantity, d.Price AS UnitPrice, (d.Quantity * d.Price) SubTotal, ISNULL(h.Discount, 0) Discount, 
// m.ModelCode, h.SODate, c.Country + ' - ' + c.Area AS Region, c.Country, c.Area, h.SOID, h.DiscountPrcnt, d.StoreTypeID, (SELECT StoreType FROM StoreTypes WHERE StoreTypeID=d.StoreTypeID) StoreType,
// CASE h.DiscountPrcnt WHEN 1 THEN (ISNULL(h.Discount, 0) * (d.Quantity * d.Price) / 100) WHEN 0 THEN ISNULL(h.Discount, 0) END TOTDiscount
// --SELECT CustID, CustName, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount
// --SELECT ModelCode, ModelName, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount
// --SELECT StoreTypeID, StoreType, COUNT(DISTINCT SOID) SalesCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount
// --SELECT Country, COUNT(DISTINCT QRY.CustID) CustCount, COUNT(DISTINCT SOID) SOCount, SUM(QRY.Quantity) Quantity ,SUM(QRY.SubTotal) SubTotal, CAST(SUM(TOTDiscount) AS REAL) TOTDiscount