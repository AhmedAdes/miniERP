export class SalesHeader {
    SOID: number;
    SODate: Date;
    CustID: number;
    CustName: string;
    ContactPerson: string;
    SalesTax: number;
    Discount: number;
    Notes: string;
    DeliveryDate: Date;
    Commisioner: string;
    CommisionerTel: string;
    GrandTotal: number;
    DeliveryType: string;
    PayMethod: string;
    SalesRepID: number;
    SalesPerson: string;
    UserID: number;
    UserName: string;

    DisplayNames = {
        SOID: { Disp: "Sales Order امرالبيع" },
        SODate: { Disp: "Sales Date التاريخ" },
        CustID: { Disp: "Customer العميل" },
        CustName: { Disp: "Customer العميل" },
        ContactPerson: { Disp: "Contact Person المسئول" },
        SalesTax: { Disp: "SalesTax % ضريبة المبيعات" },
        Discount: { Disp: "Discount % الخصم" },
        Notes: { Disp: "Notes ملاحظات" },
        DeliveryDate: { Disp: "Delivery Date تاريخ التسليم" },
        Commisioner: { Disp: "Sales Rep. مندوب البيع" },
        CommisionerTel: { Disp: "Sales Rep. Tel. تليفون مندوب البيع" },
        GrandTotal: { Disp: "Grand Total المبلغ الاجمالي" },
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

    DisplayNames = {
        SOID: { Disp: "Sales Order امرالبيع" },
        Quantity: { Disp: "Quantity الكمية" },
        Price: { Disp: "Price السعر" },
        ColorID: { Disp: "Color اللون" },
        ColorName: { Disp: "Color اللون" },
        ModelID: { Disp: "Model الموديل" },
        ModelName: { Disp: "Model الموديل" },
        ModelCode: { Disp: "Model Code كود الموديل" },
        UserName: { Disp: "User Name" }
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
}
export class rptCompareSales{
    ModelCode: string;
    ModelName: string;
    M1Quantity: number;
    M1Amount: number;
    M2Quantity: number;
    M2Amount: number;   
}

// M1.ModelCode, M1.ModelCode, M1.Quantity M1Quantity, M1.Amount M1Amount, M2.Quantity M2Quantity, M2.Amount M2Amount
//  h.CustID, c.CustName, d.ColorID, m.ModelName, d.Quantity, d.Price AS UnitPrice, h.GrandTotal, ISNULL(h.Discount, 0) Discount, m.ModelCode