export class Model {
    ModelID: number;
    ModelCode: string;
    ModelName: string;
    ProdModelID: string;
    BrandID: string;
    BrandName: string;
    ProdType: string;
    Photo: string;
    PricePiece: number;
    PriceWholeSale: number;
    PriceStores: number;
    UserID: number;
    UserName: string;
    SelectedProductImgSrc: string;
    WashID: number;
    WashType: string;

    DisplayNames = {
        ModelID: { Disp: "Model الموديل" },
        ModelCode: { Disp: "ModelCode كود الموديل" },
        ModelName: { Disp: "Model Name الموديل" },
        BrandName: { Disp: "Brand Name الماركة" },
        ProdType: { Disp: "Type النوع" },
        Photo: { Disp: "Photo الصورة" },
        PricePiece: { Disp: "Price /Piece سعر القطعة" },
        PriceWholeSale: { Disp: "Price /WholeSale سعر الجملة" },
        PriceStores: { Disp: "Price /Stores سعر المحلات" },
        UserName: { Disp: "User Name" },
        WashType: { Disp: "Wash Type نوع الغسلة" }
    }
}

export class ModelColor {
    ColorID: number;
    ProdColorCode: string;
    Color: string;
    ColorName: string;
    ModelID: number;
    ModelName: string;
    UserID: number;
    UserName: string;

    DisplayNames = {
        ColorID: { Disp: "Color اللون" },
        ProdColorCode: { Disp: "ProdCode كود المنتج" },
        Color: { Disp: "Color اللون" },
        ColorName: { Disp: "Color اللون" },
        ModelID: { Disp: "Model الموديل" },
        ModelName: { Disp: "Model Name الموديل" },
        UserName: { Disp: "User Name" }
    }
}

export class ModelSize {
    ProdSizeID: number;
    ModelID: number;
    SizeID: number;
    QuntPerDozen: number;
    UserID: number;
    Selected: boolean;
    
    DisplayNames = {
        ProdSizeID: { Disp: "Size المقاس" },
        SizeID: { Disp: "Size المقاس" },
        Selected: { Disp: "Selected" },
        QuntPerDozen: { Disp: "Qunt. Per Dozen الكمية في الدستة" },
        ModelID: { Disp: "Model الموديل" },
        ModelName: { Disp: "Model Name الموديل" },
        UserName: { Disp: "User Name" }
    }
}
export class WashType {
    WashID: number;
    WashType: string;
    UserID: number;
    UserName: string;
    
    DisplayNames = {
        WashID: { Disp: "Wash ID كود الغسلة" },
        WashType: { Disp: "Wash Type نوع الغسلة" },
        UserName: { Disp: "User Name" }
    }
}