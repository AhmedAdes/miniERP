import {
  Component,
  OnInit,
  Input,
  trigger,
  state,
  style,
  transition,
  animate
} from "@angular/core";
import { AuthenticationService, FinStoreService } from "../../../services";
import { FinishedStore, CurrentUser, BatchNo } from "../../../Models";

@Component({
  selector: "fin-balance",
  templateUrl: "./balance.component.html",
  styleUrls: ["../../../Styles/dashboard.css"],
  animations: [
    trigger("myAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate("500ms", style({ transform: "translateX(0)", opacity: 1 }))
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", opacity: 1 }),
        animate("500ms", style({ transform: "translateX(100%)", opacity: 0 }))
      ])
    ])
  ]
})
export class StoreBalanceComponent implements OnInit {
  constructor(
    public serv: FinStoreService,
    private auth: AuthenticationService
  ) {}

  currentUser: CurrentUser = this.auth.getUser();
  collection: FinishedStore[] = [];
  VisibleBalance: any[] = [];
  modelsList: any[] = [];
  model: FinishedStore;
  srchObj: FinishedStore = new FinishedStore();
  showTable: boolean;
  Formstate: string;
  headerText: string;
  errorMessage: string;
  orderbyString: string = "";
  orderbyClass: string = "fa fa-sort";
  piecePrices: number;
  storePrices: number;
  wholePrices: number;
  sumPackQty: number;
  sumIndvQty: number;
  sumDefQty: number;
  sumSmplQty: number;

  ngOnInit() {
    this.serv.getStoreBalanceAll().subscribe(cols => {
      this.collection = cols;
      this.sumPackQty = 0;
      this.sumIndvQty = 0;
      this.sumDefQty = 0;
      this.sumSmplQty = 0;
      let unique = this.collection
        .map(cl => {
          return cl.ColorID + '#' + cl.BatchNo ;
        })
        .filter((x, i, a) => a.indexOf(x) == i);
      this.modelsList = unique.map(mod => {
        let selMod = this.collection.filter(c => c.ColorID == +mod.split('#')[0] && c.BatchNo == mod.split('#')[1]);
        return {
          ModelCode: selMod[0].ModelCode,
          ModelName: selMod[0].ModelName,
          ColorName: selMod[0].ColorName,
          BatchNo: selMod[0].BatchNo,
          Color: selMod.findIndex(s => s.Quantity > 0) > -1,
          stores: selMod.map(m => {
            return {
              StoreType: m.StoreType,
              Quantity: m.Quantity,
              ReceivingQty: m.ReceivingQty,
              DispensingQty: m.DispensingQty,
              EqualizeQty: m.EqualizeQty,
              Color: m.StoreTypeID == 1 ? 'primary' : m.StoreTypeID == 2 ? 'danger' : m.StoreTypeID == 3 ? 'success' : 'dark'
            };
          })
        };
      });
      this.ZeroBalance(true);
      this.serv.getBalanceSubDetails().subscribe(ret => {
        this.piecePrices = ret.piece[0].SumPiecePrice;
        this.storePrices = ret.store[0].SumStoresPrice;
        this.wholePrices = ret.whole[0].SumWholeSalePrice;
        this.collection.forEach(element => {
          switch (element.StoreTypeID) {
            case 1:
              this.sumPackQty += element.Quantity;
              break;
            case 2:
              this.sumIndvQty += element.Quantity;
              break;
            case 3:
              this.sumDefQty += element.Quantity;
              break;
            case 4:
              this.sumSmplQty += element.Quantity;
              break;
            default:
              break;
          }
          this.sumPackQty += element.Quantity;
        });
      });
    });
    this.TableBack();
  }

  TableBack() {
    this.showTable = true;
    this.Formstate = null;
    this.errorMessage = null;
  }

  SortTable(column: string) {
    if (this.orderbyString.indexOf(column) == -1) {
      this.orderbyClass = "fa fa-sort-amount-asc";
      this.orderbyString = "+" + column;
    } else if (this.orderbyString.indexOf("-" + column) == -1) {
      this.orderbyClass = "fa fa-sort-amount-desc";
      this.orderbyString = "-" + column;
    } else {
      this.orderbyClass = "fa fa-sort";
      this.orderbyString = "";
    }
  }
  ZeroBalance(active) {
    if (active) {
      this.VisibleBalance = this.modelsList.filter(c => {return c.stores.findIndex(s => s.Quantity > 0) > -1});
    } else {
      this.VisibleBalance = this.modelsList;
    }
  }
}
