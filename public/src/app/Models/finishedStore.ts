export class FinishedStore {
  ModelCode: string;
  ModelName: string;
  Color: string;
  ColorName: string;
  ColorID: number;
  ProdColorCode: string;
  Quantity: number;
  BatchNo: string;
  Entryno: string;
  StoreType: string;
  StoreTypeID: number;
  ReceivingQty: number;
  DispensingQty: number;
  EqualizeQty: number;
  TransferQty: number;

  DisplayNames = {
    ModelCode: { Disp: 'Model Code كود الموديل' },
    ModelName: { Disp: 'Model Name الموديل' },
    Color: { Disp: 'Color اللون' },
    ColorName: { Disp: 'Color اللون' },
    ColorID: { Disp: 'ColorID كود اللون' },
    ProdColorCode: { Disp: 'ProdCode كود المنتج' },
    Quantity: { Disp: 'Quantity الكمية' },
    BatchNo: { Disp: 'BatchNo رقم التشغيلة' },
    StoreType: { Disp: 'Store Type نوع مخزن المنتج' },
    Entryno: { Disp: 'User Name' }
  };
}

export class FinishedStoreDetail {
  FinStoreID: number;
  RecYear: number;
  SerialNo: number;
  RecordDate: Date;
  Quantity: number;
  BatchNo: string;
  FinReceivingID: number;
  FinDispensingID: number;
  FinEqualizeID: number;
  FinReturnID: number;
  FinRejectID: number;
  FinTransferID: number;
  ColorID: number;
  ColorName: string;
  UserID: number;
  UserName: string;
  ModelID: number;
  ModelCode: string;
  ModelName: string;
  SOID: number;
  Stock: number;
  StoreType: string;
  StoreTypeID: number;

  DisplayNames = {
    SOID: { Disp: 'Sales Order امرالبيع' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    RecordDate: { Disp: 'Record Date التاريخ' },
    Quantity: { Disp: 'Quantity الكمية' },
    BatchNo: { Disp: 'BatchNo رقم التشغيلة' },
    ModelID: { Disp: 'Model الموديل' },
    ModelCode: { Disp: 'Model Code كود الموديل' },
    ModelName: { Disp: 'Model الموديل' },
    ColorName: { Disp: 'Color اللون' },
    Stock: { Disp: 'Store Stock رصيد المخزن' },
    StoreType: { Disp: 'Store Type نوع مخزن المنتج' },
    UserName: { Disp: 'User Name' }
  };
}

export class FinishedReceiving {
  FinReceivingID: number;
  RecYear: number;
  SerialNo: number;
  ReceivingDate: Date;
  ManfDate: Date;
  BatchNo: string;
  ReceivedFrom: string;
  UserID: number;
  UserName: string;
  SumQty: number;

  DisplayNames = {
    FinReceivingID: { Disp: 'Code الكود' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    ReceivingDate: { Disp: 'Receiving Date تاريخ الاستلام' },
    ManfDate: { Disp: 'Manf. Date تاريخ الانتاج' },
    BatchNo: { Disp: 'BatchNo رقم التشغيلة' },
    ReceivedFrom: { Disp: 'Received From مستلم من' },
    SumQty: { Disp: 'Total Quantity اجمالي الكمية' },
    UserName: { Disp: 'User Name' }
  };
}

export class FinishedDispensing {
  FinDispensingID: number;
  RecYear: number;
  SerialNo: number;
  DispensingDate: Date;
  SOID: number;
  DispenseTo: string;
  UserID: number;
  UserName: string;
  CustName: string;
  SumQty: number;

  DisplayNames = {
    SOID: { Disp: 'Sales Order امرالبيع' },
    FinDispensingID: { Disp: 'Code الكود' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    DispensingDate: { Disp: 'Dispensing Date تاريخ الصرف' },
    DispenseTo: { Disp: 'DispenseTo صرف إلي' },
    CustName: { Disp: 'Customer اسم العميل' },
    SumQty: { Disp: 'Total Quantity اجمالي الكمية' },
    UserName: { Disp: 'User Name' }
  };
}

export class FinishedReject {
  FinRejectID: number;
  RecYear: number;
  SerialNo: number;
  RejectDate: Date;
  RejectReason: string;
  UserID: number;
  UserName: string;

  DisplayNames = {
    FinRejectID: { Disp: 'Code الكود' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    RejectDate: { Disp: 'Reject Date تاريخ الرفض' },
    RejectReason: { Disp: 'Reject Reason سبب الرفض' },
    UserName: { Disp: 'User Name' }
  };
}

export class FinishedReturn {
  FinReturnID: number;
  RecYear: number;
  SerialNo: number;
  ReturnDate: Date;
  ReturnFrom: string;
  ReturnReason: string;
  UserID: number;
  UserName: string;
  SOID: number;
  SumQty: number;

  DisplayNames = {
    FinReturnID: { Disp: 'Code الكود' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    ReturnDate: { Disp: 'Return Date تاريخ المرتجع' },
    ReturnFrom: { Disp: 'Return From مرتجع من' },
    ReturnReason: { Disp: 'Return Reason سبب المرتجع' },
    SOID: { Disp: 'Sales Order امرالبيع' },
    SumQty: { Disp: 'Total Quantity اجمالي الكمية' },
    UserName: { Disp: 'User Name' }
  };
}

export class FinishedEqualization {
  FinEqualizeID: number;
  RecYear: number;
  SerialNo: number;
  EqualizeDate: Date;
  EqualizeType: string;
  UserID: number;
  UserName: string;
  SumQty: number;

  DisplayNames = {
    FinEqualizeID: { Disp: 'Code الكود' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    EqualizeDate: { Disp: 'Equalize Date التاريخ' },
    EqualizeType: { Disp: 'Equalize Type نوع التسوية' },
    SumQty: { Disp: 'Total Quantity اجمالي الكمية' },
    UserName: { Disp: 'User Name' }
  };
}

export class Barcode {
  ModelID: number;
  ModelName: string;
  ModelCode: string;
  ColorID: number;
  ProdColorCode: string;
  ColorName: string;
  BatchNo: string;
  Quantity: number;
  DisplayNames = {
    ModelCode: { Disp: 'Model Code كود الموديل' },
    ModelName: { Disp: 'Model Name الموديل' },
    Color: { Disp: 'Color اللون' },
    ColorName: { Disp: 'Color اللون' },
    ColorID: { Disp: 'ColorID كود اللون' },
    ProdColorCode: { Disp: 'ProdCode كود المنتج' },
    Quantity: { Disp: 'Quantity الكمية' },
    BatchNo: { Disp: 'BatchNo رقم التشغيلة' }
  };
}

export class BatchNo {
  BatchNo: string;
  Stock: number;
}

export class FinishedTransfer {
  FinTransferID: number;
  RecYear: number;
  SerialNo: number;
  TransferDate: Date;
  FromStoreID: number;
  FromStoreName: string;
  ToStoreID: number;
  ToStoreName: string;
  UserID: number;
  UserName: string;
  SumQty: number;

  DisplayNames = {
    FinTransferID: { Disp: 'Code الكود' },
    RecYear: { Disp: 'Year السنة' },
    SerialNo: { Disp: 'SerialNo مسلسل' },
    TransferDate: { Disp: 'Transfer Date التاريخ' },
    FromStoreName: { Disp: 'From Store من مخزن' },
    ToStoreName: { Disp: 'To Type إلي مخزن' },
    SumQty: { Disp: 'Total Quantity اجمالي الكمية' },
    UserName: { Disp: 'User Name' }
  };
}
