import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, SalesHeaderService, SalesDetailService, SalesPaymentService, CustomerService, ModelService } from '../../../services';
import { Customer, CurrentUser, SalesHeader, SalesDetail, SalesPayment, CustTypes, Model } from '../../../Models';
import { Router } from '@angular/router';

@Component({
    selector: 'sales-order',
    templateUrl: './SOrder.component.html',
    animations: [
        trigger(
            'myAnimation', [
                transition(':enter', [
                    style({ transform: 'translateX(100%)', opacity: 0 }),
                    animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
                ]),
                transition(':leave', [
                    style({ transform: 'translateX(0)', 'opacity': 1 }),
                    animate('500ms', style({ transform: 'translateX(100%)', opacity: 0 }))
                ])
            ]
        )
    ]
})
export class SalesOrderComponent implements OnInit {

    constructor(private auth: AuthenticationService, private srvCust: CustomerService,
        private srvHead: SalesHeaderService, private srvDet: SalesDetailService,
        private srvPay: SalesPaymentService, private srvModel: ModelService,
        private router: Router) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: SalesHeader[] = [];
    SDetails: SalesDetail[] = [];
    SPayments: SalesPayment[] = [];
    modelsList: Model[];
    model: SalesHeader = new SalesHeader();
    Detmodel: SalesDetail = new SalesDetail();
    PayModel: SalesPayment = new SalesPayment();
    srchHeadObj: SalesHeader = new SalesHeader();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    today = new Date();
    subtotal: number;
    headerValid: boolean;
    SalesRepExist: boolean;
    stillSaving: boolean

    ngOnInit() {
        this.srvHead.getSalesHeader().subscribe(cols => {
            this.collection = cols;
            this.srvModel.getModel().subscribe(mod => {
                this.modelsList = mod;
                this.TableBack();
                this.SalesRepExist = false;
            })
        });
    }

    CreateNew() {
        this.model = new SalesHeader();
        this.SalesRepExist = false;
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Sales Order';
    }
    LoadDetails(id, state) {
        this.srvHead.getSalesHeader(id).subscribe(mat => {
            this.model = mat[0];
            this.srvDet.getSalesDetail(id).subscribe(det => {
                this.SDetails = det;
                this.srvPay.getSalesOrderPayment(id).subscribe(pay => {
                    this.SPayments = pay;
                    this.CalculateTotal();
                    this.showTable = false;
                    this.Formstate = state;
                    this.headerText = state == 'Detail' ? `Sales Order ${state}s` : `${state} Sales Order`;
                })
            });
        });
    }
    EditThis(id: number) {
        this.LoadDetails(id, 'Edit');
    }
    ShowDetails(id: number) {
        this.LoadDetails(id, 'Detail');
    }
    Delete(id: number) {
        this.LoadDetails(id, 'Delete');
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Sales Orders';
        this.errorMessage = null;
        this.model = new SalesHeader();
        this.Detmodel = new SalesDetail();
        this.PayModel = new SalesPayment();
        this.SDetails = [];
        this.SPayments = [];
        this.stillSaving = false
    }
    HandleForm(event) {
        event.preventDefault();
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID;

        if (this.SDetails.length == 0) {
            this.errorMessage = "Must Add some Products First";
            this.stillSaving = false
            return;
        }
        if (this.SPayments.length == 0) {
            this.errorMessage = "Must Add some Payments First";
            this.stillSaving = false
            return;
        }
        if (!this.headerValid) {
            this.errorMessage = "Please Validate Basic Data";
            this.stillSaving = false
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.srvHead.insertFullSalesHeader(this.model, this.SDetails, this.SPayments).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.srvHead.updateFullSalesHeader(this.model.SOID, this.model, this.SDetails, this.SPayments).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.srvHead.deleteSalesHeader(this.model.CustID).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;

            default:
                break;
        }
    }

    SortTable(column: string) {
        if (this.orderbyString.indexOf(column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-asc";
            this.orderbyString = '+' + column;
        } else if (this.orderbyString.indexOf('-' + column) == -1) {
            this.orderbyClass = "fa fa-sort-amount-desc";
            this.orderbyString = '-' + column;
        } else {
            this.orderbyClass = 'fa fa-sort';
            this.orderbyString = '';
        }
    }


    DeleteDetail(i: number) {
        this.SDetails.splice(i, 1);
        this.CalculateTotal();
    }
    DeletePayment(i: number) {
        this.SPayments.splice(i, 1);
    }
    custChanged(newCustID) {
        var CustType;
        if (!newCustID) { return }
        this.srvCust.getCustomer(newCustID).subscribe(cst => {
            CustType = cst[0].CustType;
            if (this.Detmodel.ModelID) {
                var selectedModel = this.modelsList.filter(obj => obj.ModelID == this.Detmodel.ModelID)[0];
                switch (CustType) {
                    case CustTypes[0].name:
                        this.Detmodel.Price = selectedModel.PriceWholeSale;
                        break;
                    case CustTypes[1].name:
                        this.Detmodel.Price = selectedModel.PriceStores;
                        break;
                    case CustTypes[2].name:
                        this.Detmodel.Price = selectedModel.PricePiece;
                        break;
                    default:
                        break;
                }
            }
        })
    }

    CalculateTotal() {
        this.subtotal = 0;
        this.SDetails.forEach(element => {
            this.subtotal += element.Price * element.Quantity;
        });
        let discnt = this.model.Discount ? this.model.DiscountPrcnt ? (this.model.Discount / 100 * this.subtotal) : this.model.Discount : 0
        this.model.GrandTotal = this.subtotal +
            ((this.model.SalesTax ? this.model.SalesTax : 0) / 100 * this.subtotal) - discnt
    }

    ValidateHeader(value) {
        this.headerValid = value
    }

    ValidateTotal() {
        var subtotal = 0;
        this.SPayments.forEach(element => {
            subtotal += element.PayAmount;
        });
        if (this.model.GrandTotal < subtotal) {
            this.errorMessage = "Grand Total is Greater Than the Paid Amount";
        }
    }

    changeRepExist(value) {
        this.SalesRepExist = value;
    }
    PrintInvoice(soid) {
        this.router.navigate(['printout/invoice', soid])
        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
}
