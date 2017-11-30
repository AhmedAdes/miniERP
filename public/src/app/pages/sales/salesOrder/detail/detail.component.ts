import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  SalesDetail,
  CurrentUser,
  Customer,
  CustTypes,
  DeliveryTypes,
  PayMethods,
  Model,
  ModelColor,
  StoreProductTypes
} from "../../../../Models";
import {
  ModelService,
  ColorService,
  CustomerService,
  FinDetailService
} from "../../../../services";
import {
  Form,
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  AbstractControl
} from "@angular/forms";
import { min, max } from "../../../../pipes/validators";
import { CompleterService, CompleterData, CompleterItem } from "ng2-completer";

@Component({
  selector: "sales-detail",
  templateUrl: "./detail.html"
})
export class SalesDetailComponent implements OnInit {
  @Input() Details: SalesDetail[];
  @Input() Detmodel: SalesDetail;
  @Input() currentUser: CurrentUser;
  @Input() CustomerID: number;
  @Input() modelsList: Model[];
  @Output() CalculateTotal = new EventEmitter();
  colorList: ModelColor[];
  modelIDsList: CompleterData;
  colortext: string;
  errorMessage: string;
  selectedModel: Model;
  selectedModelID: number;
  submitted: boolean = false;
  prodTypes = StoreProductTypes;
  detform: FormGroup;
  ctrlModelID: AbstractControl;
  ctrlModelauto: AbstractControl;
  ctrlColorID: AbstractControl;
  ctrlType: AbstractControl;
  ctrlQuant: AbstractControl;
  ctrlPrice: AbstractControl;
  ctrlStocks: AbstractControl;

  constructor(
    private srvClr: ColorService,
    private srvCust: CustomerService,
    private srvCmp: CompleterService,
    private srvFin: FinDetailService,
    private fb: FormBuilder
  ) {
    this.detform = fb.group({
      modelId: ["", Validators.required],
      modelauto: [""],
      colorId: ["", Validators.required],
      strProdType: ["", Validators.required],
      quant: ["", [Validators.required, min(0)]],
      price: ["", [Validators.required, min(0)]],
      stk: [""]
    });

    this.ctrlModelID = this.detform.controls["modelId"];
    this.ctrlModelauto = this.detform.controls["modelauto"];
    this.ctrlColorID = this.detform.controls["colorId"];
    this.ctrlType = this.detform.controls["strProdType"];
    this.ctrlQuant = this.detform.controls["quant"];
    this.ctrlPrice = this.detform.controls["price"];
    this.ctrlStocks = this.detform.controls["stk"];

    this.ctrlModelID.valueChanges.subscribe(value => this.onProdChange(value));
    this.ctrlColorID.valueChanges.subscribe(value => this.onColorChange(value));
    this.ctrlType.valueChanges.subscribe(value =>
      this.onstrProdTypeChange(value)
    );
  }

  ngOnInit() {
    var IDs = this.modelsList.map(m => {
      return { ID: m.ModelID.toString(), Code: m.ModelCode };
    });
    this.modelIDsList = this.srvCmp.local(IDs, "Code", "Code").descriptionField("ID");
    this.selectedModelID = this.Detmodel.ModelID;
    // this.selectedColor = this.Detmodel.ColorID;
  }

  AddDetail(event) {
    this.submitted = true;
    if (!this.detform.valid) {
      return;
    }
    if (
      this.Details.findIndex(
        x =>
          x.ModelID == this.Detmodel.ModelID &&
          x.ColorID == this.Detmodel.ColorID &&
          x.StoreTypeID == this.Detmodel.StoreTypeID
      ) > -1
    ) {
      this.errorMessage = "Trying to add a Duplicate Model is Prohibited !"
      return;
    } else {
      this.errorMessage = ""
      this.Detmodel.ModelID = this.selectedModelID;
      this.Detmodel.ModelName = this.selectedModel.ModelName;
      this.Detmodel.ModelCode = this.selectedModel.ModelCode;
      this.Detmodel.ColorName =
        this.colortext == null ? this.colorList.find(c => c.ColorID == this.Detmodel.ColorID).ColorName : this.colortext;
      this.Detmodel.UserID = this.currentUser.userID;
      this.Detmodel.StoreType = this.prodTypes.find(
        st => st.ID == this.Detmodel.StoreTypeID
      ).name;
      this.Details.push(this.Detmodel);
      this.Detmodel = new SalesDetail();
      this.selectedModelID = null;
      this.CalculateTotal.emit();
      this.detform.reset();
      this.submitted = false;
      // event.preventDefault();
    }
  }

  onProdChange(value) {
    //newObj.target.value.split(":")[0]
    var CustType;
    if (!value) {
      return;
    }
    this.Detmodel.ModelID = this.selectedModelID;
    this.srvClr.getColor(value).subscribe(clrs => {
      this.colorList = clrs;
      this.Detmodel.StoreTypeID = null;
      this.Detmodel.Stock = "";
      this.selectedModel = this.modelsList.filter(
        obj => obj.ModelID == value
      )[0];
      if (this.CustomerID) {
        this.srvCust.getCustomer(this.CustomerID).subscribe(cst => {
          CustType = cst[0].CustType;
          switch (CustType) {
            case CustTypes[0].name:
              this.Detmodel.Price = this.selectedModel.PriceWholeSale;
              break;
            case CustTypes[1].name:
              this.Detmodel.Price = this.selectedModel.PriceStores;
              break;
            case CustTypes[2].name:
              this.Detmodel.Price = this.selectedModel.PricePiece;
              break;
            default:
              break;
          }
        });
      }
    });
  }
  onColorChange(value) {
    if (!value || this.colorList.length <= 0) {
      return;
    }
    this.Detmodel.ColorName = this.colorList.find(
      c => c.ColorID == value
    ).ColorName;
  }
  onstrProdTypeChange(value) {
    if (!value || !this.prodTypes) {
      return;
    }
    this.srvFin
      .getFinStockwithOrders(this.Detmodel.ColorID, value)
      .subscribe(stk => {
        this.Detmodel.Stock =
          stk.stock[0].StockQty.toString() +
          " in Stock with " +
          stk.orders[0].OrderQty.toString() +
          " on Orders /-/-/ Total of " +
          (stk.stock[0].StockQty - stk.orders[0].OrderQty);
          this.ctrlQuant.setValidators([Validators.required, min(0), max(stk.stock[0].StockQty)])
      });
  }

  IDSelected(selected: CompleterItem) {
    if (selected) {
      this.selectedModelID = parseInt(selected.description);
    } else {
      this.selectedModelID = null;
    }
  }
}
