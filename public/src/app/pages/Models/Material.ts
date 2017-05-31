export class Material {
    MaterialID: number;
    MaterialName: string;
    Category: string;
    Onz: string;
    Color: string;
    ClothLength: number;
    ClothWidth: number;
    Unit: string;
    IndigoGrade: number;
    CottonPercent: number;
    LykraPercent: number;
    ShrinkPercent: number;
    PolyesterPercent: number;
    UserID: number;
    UserName: string;

    DisplayNames = {
        MaterialID: { Disp: "Material الخامة" },
        MaterialName: { Disp: "Material Name اسم الخامة" },
        Category: { Disp: "Category التصنيف" },
        Onz: { Disp: "Ounce(oz)" },
        Color: { Disp: "Color اللون" },
        ClothLength: { Disp: "Cloth Length طول التوب" },
        ClothWidth: { Disp: "Cloth Width عرض التوب" },
        Unit: { Disp: "Unit الوحدة" },
        IndigoGrade: { Disp: "Indigo Grade درجة الصبغة" },
        CottonPercent: { Disp: "Cotton Percent نسبة القطن" },
        LykraPercent: { Disp: "Lykra Percent نسبة ليكرا" },
        ShrinkPercent: { Disp: "Shrink Percent نسبة الانكماش" },
        PolyesterPercent: { Disp: "Polyester Percent نسبة بوليستر" },
        UserName: { Disp: "User Name" }
    }
}