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
        UserName: { Disp: "User Name" }
    }
}
