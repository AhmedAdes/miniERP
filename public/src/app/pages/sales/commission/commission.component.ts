import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, SalesPaymentService } from '../../services/index';
import { SalesPayment, CurrentUser } from '../../Models/index';

@Component({
    selector: 'sales-commission',
    templateUrl: './commission.component.html',
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
export class CommissionComponent implements OnInit {

    constructor(public serv: SalesPaymentService, private auth: AuthenticationService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: SalesPayment[] = [];
    model: SalesPayment;
    srchObj: SalesPayment = new SalesPayment();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    cnvSODate: string;
    cnvCommDate: string;

    ngOnInit() {
        this.serv.getSalesPayment().subscribe(cols => {
            this.collection = cols;
            this.collection = this.collection.filter(obj => obj.CommisionAmount != null);
            });
        this.TableBack();
    }

    HandleDate(date: Date) {
        var dd = date.getDate();
        var mm = date.getMonth() + 1; //January is 0!
        var yyyy = date.getFullYear();

        var goodDate: Date = new Date(yyyy + "/" + mm + "/" + dd);
        goodDate.setDate(goodDate.getDate() + 1);
        var Ret = goodDate.toISOString();
        return goodDate.toISOString().substring(0, 10);
    }
    //   CreateNew() {
    //     this.model = new SalesPayment();
    //     this.showTable = false;
    //     this.Formstate = 'Create';
    //     this.headerText = 'Create New Payment';
    //   }

    EditThis(id: number) {
        this.serv.getSalesPayment(id).subscribe(mat => {
            this.model = mat[0];
            this.cnvSODate = this.HandleDate(new Date(this.model.SODate));
            this.cnvCommDate = this.HandleDate(new Date(this.model.CommisionPaymentDate));
            this.showTable = false;
            this.Formstate = 'Edit';
            this.headerText = 'Edit Payment';
        });
    }
    ShowDetails(id: number) {
        this.serv.getSalesPayment(id).subscribe(mat => {
            this.model = mat[0];
            this.cnvSODate = this.HandleDate(new Date(this.model.SODate));
            this.cnvCommDate = this.HandleDate(new Date(this.model.CommisionPaymentDate));
            this.showTable = false;
            this.Formstate = 'Detail';
            this.headerText = 'Payment Details';
        });
    }
    //   Delete(id: number) {
    //     this.serv.getSalesPayment(id).subscribe(mat => {
    //       this.model = mat[0];
    //       this.showTable = false;
    //       this.Formstate = 'Delete';
    //       this.headerText = 'Delete Payment';
    //     });
    //   }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.errorMessage = null;
    }
    HandleForm(event) {
        event.preventDefault();
        this.model.UserID = this.currentUser.userID;
        this.model.CommsionPaid = true;

        switch (this.Formstate) {
            //   case 'Create':
            //     this.serv.insert(this.model).subscribe(ret => {
            //       if (ret.error) {
            //         this.errorMessage = ret.error.message;
            //       } else if (ret.affected > 0) {
            //         this.ngOnInit();
            //       }
            //     }, err => this.errorMessage = err.message);
            //     break;
            case 'Edit':
                this.serv.updateSalesPayment(this.model.SOPayID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            //   case 'Delete':
            //     this.serv.deleteSalesPayment(this.model.SOPayID).subscribe(ret => {
            //       if (ret.error) {
            //         this.errorMessage = ret.error.message;
            //       } else if (ret.affected > 0) {
            //         this.ngOnInit();
            //       }
            //     }, err => this.errorMessage = err.message);
            //     break;

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
}
