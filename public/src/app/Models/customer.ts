export class Customer {
    CustID: number;
    CustName: string;
    CustType: string;
    Country: string;
    Area: string;
    Address: string;
    Tel: string;
    Email: string;
    Website: string;
    ContactPerson: string;
    CreateDate: Date;
    UserID: number;
    UserName: string;
    ProvinceID: number;
    Province: string;
    engName: string;
    RegionID: number;
    Region: string;

    DisplayNames = {
        CustID: { Disp: "Customer العميل" },
        CustName: { Disp: "Name اسم العميل" },
        CustType: { Disp: "Type نوع العميل" },
        Country: { Disp: "Country المحافظة" },
        Area: { Disp: "Area المنطقة" },
        Address: { Disp: "Address العنوان" },
        Tel: { Disp: "Tel. تليفون" },
        Email: { Disp: "Email ايميل" },
        Website: { Disp: "Website موقع الكتروني" },
        ContactPerson: { Disp: "Contact Person المسئول" },
        UserName: { Disp: "User Name" },
        ProvinceID: { Disp: "Province المحافظة" },
        Province: { Disp: "Province اسم المحافظة" },
        engName: { Disp: "English Name الاسم بالانجليزية" },
        RegionID: { Disp: "Region المنطقة" },
        Region: { Disp: "Region اسم المنطقة" },
    }
    
}

export class rptTopCustomers {
    CustID: number;
    CustName: string;
    Quantity: number;
    GT: number;
    Perc: number;
    AllQty: number;
}

export class Province {
    ProvinceID: number;
    Province: string;
    engName: string;

    DisplayNames = {
        ProvinceID: { Disp: "Province المحافظة" },
        Province: { Disp: "Province اسم المحافظة" },
        engName: { Disp: "English Name الاسم بالانجليزية" },
    }
}

export class Region {
    RegionID: number;
    Region: string;
    ProvinceID: number;
    Province: string;

    DisplayNames = {
        RegionID: { Disp: "Region المنطقة" },
        Region: { Disp: "Region اسم المنطقة" },
        ProvinceID: { Disp: "Province المحافظة" },
        Province: { Disp: "Province اسم المحافظة" },
    }
}