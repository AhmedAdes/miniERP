import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinReturnService, FinDetailService, ModelService } from '../../services/index';
import { CurrentUser, FinishedReturn, FinishedStoreDetail, Model } from '../../Models/index';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'fin-Ret',
    templateUrl: './return.component.html',
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
export class FinReturnComponent implements OnInit {
    //RecYear ,SerialNo ,ReturnDate ,ReturnFrom ,ReturnReason ,UserID
    constructor(public srvEqul: FinReturnService, private auth: AuthenticationService,
        private srvDet: FinDetailService, private srvModel: ModelService, fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            RecDate: ['', Validators.required],
            RetFrom: ['', Validators.required],
            RetReason: ['', Validators.required]
        });

        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        // this.basicform.controls['ReturnType'].valueChanges.subscribe(value => this.onchkchange(value));
    }

    currentUser: CurrentUser = this.auth.getUser();
    collection: FinishedReturn[] = [];
    finDetails: FinishedStoreDetail[] = [];
    modelsList: Model[];
    model: FinishedReturn = new FinishedReturn();
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    srchObj: FinishedReturn = new FinishedReturn();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    cnvRecDate: string;
    basicform: FormGroup;
    stillSaving: boolean

    ngOnInit() {
        this.srvEqul.getReturn().subscribe(cols => {
            this.collection = cols;
            this.srvModel.getModel().subscribe(mod => {
                this.modelsList = mod;
                this.TableBack();
            })
        });
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

    CreateNew() {
        this.model = new FinishedReturn();
        this.cnvRecDate = this.model.ReturnDate ? this.HandleDate(new Date(this.model.ReturnDate)) : this.HandleDate(new Date());
        // this.srvDet.getFinRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Finished Store Return';
        // })
    }
    LoadDetails(id, state) {
        this.srvEqul.getReturn(id).subscribe(mat => {
            this.model = mat[0];
            this.srvDet.getFinRetDetail(id).subscribe(det => {
                this.finDetails = det;
                this.cnvRecDate = this.model.ReturnDate ? this.HandleDate(new Date(this.model.ReturnDate)) : this.HandleDate(new Date());
                this.showTable = false;
                this.Formstate = state;
                this.headerText = state == 'Detail' ? `Finished Store Return ${state}s` : `${state} Finished Store Return`;
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
        this.headerText = "";
        this.errorMessage = null;
        this.model = new FinishedReturn();
        this.Detmodel = new FinishedStoreDetail();
        this.finDetails = [];
        this.stillSaving = false
        this.basicform.reset();
    }
    HandleForm(event) {
        event.preventDefault();
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID;
        this.model.RecYear = new Date().getFullYear();
        if (this.finDetails.length == 0) {
            this.errorMessage = "Must Add some Products First";
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.srvEqul.insertReturn(this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.srvEqul.updateReturn(this.model.FinReturnID, this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.srvEqul.deleteReturn(this.model.FinReturnID).subscribe(ret => {
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
    onRecDatechange(value) {
        if (value) {
            this.model.ReturnDate = value;
        }
    }
    DeleteDetail(i: number) {
        this.finDetails.splice(i, 1);
    }
    EditDetail(i: number) {
        this.Detmodel = new FinishedStoreDetail()
        this.Detmodel.FinStoreID = this.finDetails[i].FinStoreID;
        this.Detmodel.FinReturnID = this.finDetails[i].FinReturnID;
        this.Detmodel.RecordDate = this.finDetails[i].RecordDate;
        this.Detmodel.RecYear = this.finDetails[i].RecYear;
        this.Detmodel.SerialNo = this.finDetails[i].SerialNo;
        this.Detmodel.ModelID = this.finDetails[i].ModelID;
        this.Detmodel.ColorID = this.finDetails[i].ColorID;
        this.Detmodel.Quantity = this.finDetails[i].Quantity;
        this.Detmodel.BatchNo = this.finDetails[i].BatchNo;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/finRec', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
}