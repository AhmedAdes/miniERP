export class Expanses{
   ExpanseID: number;
   ExpanseName: string;
   ExpanseType: string;
   Amount: number;
   ExpanseDate: Date
   ResPerson: string;
   UserID: number;
   UserName: string;

   DisplayNames = {
        ExpanseID: { Disp: "Expanse المصروف" },
        ExpanseName: { Disp: "Name اسم المصروف" },
        ExpanseType: { Disp: "Type نوع المصروف" },
        Amount: { Disp: "Amount الكمية" },
        ExpanseDate: { Disp: "Date التاريخ المصروف" },
        ResPerson: { Disp: "Respons. Person المسئول" },
        UserName: { Disp: "User Name" }
    }
}