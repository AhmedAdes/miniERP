export class Supplier {
    SupID: number;
    SupName: string;
    SupContactPerson: string;
    Country: string;
    Address: string;
    Tel: string;
    CommercialRecord: string;
    TaxFileNo: string;
    Email: string;
    Website: string;
    CreateDate: Date;
    Contractor: boolean;
    ContractDate: Date;
    ContractLength: number;
    UserID: number;
    UserName: string;

    DisplayNames = {
        SupID: { Disp: "Supplier المورد" },
        SupName: { Disp: "Supplier اسم المورد" },
        Country: { Disp: "Country البلد" },
        Address: { Disp: "Address العنوان" },
        Tel: { Disp: "Tel. تليفون" },
        CommercialRecord: { Disp: "Commercial Record سجل تجاري" },
        TaxFileNo: { Disp: "Tax FileNo. رقم الملف الضريبي" },
        Email: { Disp: "Email ايميل" },
        Website: { Disp: "Website موقع الكتروني" },
        SupContactPerson: { Disp: "Contact Person المسئول" },
        Contractor: { Disp: "Contractor متعاقد" },
        ContractDate: { Disp: "Contract Date تاريخ التعاقد" },
        ContractLength: { Disp: "Contract Length مدة التعاقد" },
        UserName: { Disp: "User Name" }
    }
}
