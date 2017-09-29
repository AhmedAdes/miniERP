export class MaterialStore {
    MaterialID: number;
    MaterialName: string;
    QCNO: number;
    UnitPrice: number;
    Quantity: number;

    DisplayNames = {
        MaterialID: { Disp: "Material Code كود الخامة" },
        MaterialName: { Disp: "Material Name اسم الخامة" },
        QCNO: { Disp: "QCNO رقم الدخول" },
        UnitPrice: { Disp: "Unit Price سعر الوحدة" },
        Quantity: { Disp: "Quantity الكمية" }
    }
}

export class MaterialStoreDetail {
    MatStoreID: number;
    RecYear: number;
    SerialNo: number;
    RecordDate: Date;
    Quantity: number;
    UnitPrice: number;
    SupplierBatchNo: string;
    QCNO: number;
    MatReceivingID: number;
    MatDispensingID: number;
    MatEqualizeID: number;
    MatReturnID: number;
    MaterialID: number;
    MaterialName: string;
    Category: string;
    Unit: string;
    QtyReceived: number;
    QtyApproved: number;
    SupID: number;
    SupName: string;
    UserID: number;
    UserName: string;
    Stock: number;
    ProdOrdID: number;

    DisplayNames = {
        ProdOrdID: { Disp: "Production Order امر التصنيع" },
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        RecordDate: { Disp: "Record Date التاريخ" },
        Quantity: { Disp: "Quantity الكمية" },
        SupplierBatchNo: { Disp: "Supplier BatchNo رقم تشغيلة المورد" },
        MaterialID: { Disp: "Material Code كود الخامة" },
        MaterialName: { Disp: "Material Name اسم الخامة" },
        QtyReceived: { Disp: "Received Quantity الكمية المستلمة" },
        QtyApproved: { Disp: "Approved Quantity الكمية المقبولة" },
        Unit: { Disp: "Unit الوحدة" },
        SupName: { Disp: "Supplier Name اسم المورد" },
        UnitPrice: { Disp: "Unit Price سعر الوحدة" },
        QCNO: { Disp: "QCNO رقم الدخول" },
        Stock: { Disp: "Store Stock رصيد المخزن" },
        UserName: { Disp: "User Name" }
    }
}

export class MaterialInspection {
    InspID: number;
    RecYear: number;
    SerialNo: number;
    RecDate: Date;
    ManfDate: Date;
    InvoiceNo: string;
    InvoiceDate: Date;
    BatchNo: string;
    QCNO: number;
    MaterialID: number;
    MaterialName: string;
    Category: string;
    Unit: string;
    QtyReceived: number;
    SampleQty: number;
    Approved: boolean;
    QtyApproved: number;
    ReceivedApp: boolean;
    Reject: boolean;
    QtyReject: number;
    ReceivedRej: boolean;
    UnitPrice: number;
    TotalPrice: number;
    Notes: string;
    POID: number;
    SupID: number;
    SupName: string;
    UserID: number;
    UserName: string;

    DisplayNames = {
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        RecDate: { Disp: "Date التاريخ" },
        ManfDate: { Disp: "Manf. Date تاريخ الانتاج" },
        InvoiceNo: { Disp: "Invoice No رقم الفاتورة" },
        InvoiceDate: { Disp: "Invoice Date تاريخ الفاتورة" },
        BatchNo: { Disp: "BatchNo رقم تشغيلة المورد" },
        QCNO: { Disp: "QCNO رقم الدخول" },
        MaterialID: { Disp: "Material Code كود الخامة" },
        MaterialName: { Disp: "Material Name اسم الخامة" },
        Unit: { Disp: "Unit الوحدة" },
        SupName: { Disp: "Supplier Name اسم المورد" },
        QtyReceived: { Disp: "Quantity الكمية" },
        SampleQty: { Disp: "Sample Quantity كمية العينات" },
        Approved: { Disp: "Approved مقبول" },
        QtyApproved: { Disp: "Approved Quantity الكمية المقبولة" },
        ReceivedApp: { Disp: "App.Received استلم بالمخزن" },
        Reject: { Disp: "Reject مرفوض" },
        QtyReject: { Disp: "Reject Quantity الكمية المرفوضة" },
        ReceivedRej: { Disp: "Rej.Received استلم بالمخزن" },
        UnitPrice: { Disp: "Unit Price سعر الوحدة" },
        TotalPrice: { Disp: "Total Price سعر الاجمالي" },
        Notes: { Disp: "Notes ملاحظات" },
        UserName: { Disp: "User Name" }
    }
}

export class MaterialReceiving {
    MatReceivingID: number;
    RecYear: number;
    SerialNo: number;
    ReceivingDate: Date;
    ManfDate: Date;
    InvoiceNo: string;
    InvoiceDate: Date;
    BatchNo: string;
    QCNO: number;
    POID: number;
    Quantity: number;
    InspID: number;
    SupID: number;
    SupName: string;
    UserID: number;
    UserName: string;
    UnitPrice: number;
    MaterialID: number;
    MaterialName: string;
    Category: string;
    Unit: string;

    DisplayNames = {
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        ReceivingDate: { Disp: "Receiving Date تاريخ الاستلام" },
        ManfDate: { Disp: "Manf. Date تاريخ الانتاج" },
        InvoiceNo: { Disp: "Invoice No رقم الفاتورة" },
        InvoiceDate: { Disp: "Invoice Date تاريخ الفاتورة" },
        BatchNo: { Disp: "BatchNo رقم تشغيلة المورد" },
        Quantity: { Disp: "Quantity الكمية" },
        QCNO: { Disp: "QCNO رقم الدخول" },
        SupName: { Disp: "Supplier Name اسم المورد" },
        UnitPrice: { Disp: "Unit Price سعر الوحدة" },
        MaterialID: { Disp: "Material Code كود الخامة" },
        MaterialName: { Disp: "Material Name اسم الخامة" },
        Unit: { Disp: "Unit الوحدة" },
        UserName: { Disp: "User Name" }
    }
}

export class MaterialDispensing {
    MatDispensingID: number;
    RecYear: number;
    SerialNo: number;
    DispensingDate: Date;
    DispenseTO: string;
    UserID: number;
    UserName: string;
    Category: string;

    DisplayNames = {
        // SOID: { Disp: "Sales Order امرالبيع" },
        MatDispensingID: { Disp: "Code الكود" },
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        DispensingDate: { Disp: "Dispensing Date تاريخ الصرف" },
        DispenseTO: { Disp: "DispenseTO صرف إلي" },
        UserName: { Disp: "User Name" }
    }
}

export class MaterialReject {
    MatRejectID: number;
    RecYear: number;
    SerialNo: number;
    RejectDate: Date;
    RejectReason: string;
    UserID: number;
    UserName: string;

    DisplayNames = {
        MatRejectID: { Disp: "Code الكود" },
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        RejectDate: { Disp: "Reject Date تاريخ الرفض" },
        RejectReason: { Disp: "Reject Reason سبب الرفض" },
        UserName: { Disp: "User Name" }
    }
}

export class MaterialReturn {
    MatReturnID: number;
    RecYear: number;
    SerialNo: number;
    ReturnDate: Date;
    ReturnFrom: string;
    ReturnReason: string;
    UserID: number;
    UserName: string;
    Category: string;

    DisplayNames = {
        MatReturnID: { Disp: "Code الكود" },
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        ReturnDate: { Disp: "Return Date تاريخ المرتجع" },
        ReturnFrom: { Disp: "Return From مرتجع من" },
        ReturnReason: { Disp: "Return Reason سبب المرتجع" },
        UserName: { Disp: "User Name" }
    }
}

export class MaterialEqualization {
    MatEqualizeID: number;
    RecYear: number;
    SerialNo: number;
    EqualizeDate: Date;
    EqualizeType: string;
    UserID: number;
    UserName: string;
    Category: string;

    DisplayNames = {
        MatEqualizeID: { Disp: "Code الكود" },
        RecYear: { Disp: "Year السنة" },
        SerialNo: { Disp: "SerialNo مسلسل" },
        EqualizeDate: { Disp: "Equalize Date التاريخ" },
        EqualizeType: { Disp: "Equalize Type نوع التسوية" },
        UserName: { Disp: "User Name" }
    }
}


export class QC {
    QCNO: number;
    Stock: number;
}