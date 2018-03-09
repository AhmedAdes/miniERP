import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinTransferService, FinDetailService, ModelService } from '../../../services';
import { CurrentUser, FinishedTransfer, FinishedStoreDetail, Model, StoreProductTypes } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as hf from '../../helper.functions'

@Component({
    selector: 'app-fin-trans',
    templateUrl: './transfer.component.html',
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
export class FinTransferComponent implements OnInit {
    //RecYear ,SerialNo ,TransferDate ,TransferType ,UserID
    currentUser: CurrentUser = this.auth.getUser();
    collection: FinishedTransfer[] = [];
    finDetails: FinishedStoreDetail[] = [];
    modelsList: Model[];
    transferList = StoreProductTypes;
    model: FinishedTransfer = new FinishedTransfer();
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    srchObj: FinishedTransfer = new FinishedTransfer();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = '';
    orderbyClass: string = 'fa fa-sort';
    cnvRecDate: string;
    basicform: FormGroup;
    stillSaving: boolean
    selModID: number
    reset: boolean

    constructor(public srvTrns: FinTransferService, private auth: AuthenticationService,
        private srvDet: FinDetailService, private srvModel: ModelService, fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            RecDate: ['', Validators.required],
            fromStr: ['', Validators.required],
            toStr: ['', Validators.required]
        });

        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        // this.basicform.controls['TransferType'].valueChanges.subscribe(value => this.onchkchange(value));
    }

    ngOnInit() {
        this.srvTrns.getTransfer().subscribe(cols => {
            this.collection = cols;
            this.srvModel.getModel().subscribe(mod => {
                this.modelsList = mod;
                this.TableBack();
            })
        });
    }

    CreateNew() {
        this.model = new FinishedTransfer();
        this.cnvRecDate = this.model.TransferDate ? hf.handleDate(new Date(this.model.TransferDate)) : hf.handleDate(new Date());
        // this.srvDet.getFinRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Finished Store Transfer';
        // })
    }
    LoadDetails(id, state) {
        this.srvTrns.getTransfer(id).subscribe(mat => {
            this.model = mat[0];
            this.srvDet.getFinTransDetail(id).subscribe(det => {
                this.finDetails = det;
                this.cnvRecDate = this.model.TransferDate ? hf.handleDate(new Date(this.model.TransferDate)) : hf.handleDate(new Date());
                this.showTable = false;
                this.Formstate = state;
                this.headerText = state == 'Detail' ? `Finished Store Transfer ${state}s` : `${state} Finished Store Transfer`;
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
        this.headerText = '';
        this.errorMessage = null;
        this.model = new FinishedTransfer();
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
            hf.handleError('Must Add some Products First')
            this.stillSaving = false
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.srvTrns.insertTransfer(this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                        this.stillSaving = false
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => {
                  this.stillSaving = false; hf.handleError(err);
                });
                break;
            case 'Edit':
                this.srvTrns.updateTransfer(this.model.FinTransferID, this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => {
                  this.stillSaving = false; hf.handleError(err);
                });
                break;
            case 'Delete':
                this.srvTrns.deleteTransfer(this.model.FinTransferID).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => {
                  this.stillSaving = false; hf.handleError(err);
                });
                break;

            default:
                break;
        }
    }

    SortTable(column: string) {
        if (this.orderbyString.indexOf(column) == -1) {
            this.orderbyClass = 'fa fa-sort-amount-asc';
            this.orderbyString = '+' + column;
        } else if (this.orderbyString.indexOf('-' + column) == -1) {
            this.orderbyClass = 'fa fa-sort-amount-desc';
            this.orderbyString = '-' + column;
        } else {
            this.orderbyClass = 'fa fa-sort';
            this.orderbyString = '';
        }
    }
    onRecDatechange(value) {
        if (value) {
            this.model.TransferDate = value;
        }
    }
    DeleteDetail(i: number) {
        this.finDetails.splice(i, 1);
    }
    EditDetail(i: number) {
        this.Detmodel = new FinishedStoreDetail()
        this.Detmodel.FinStoreID = this.finDetails[i].FinStoreID;
        this.Detmodel.FinTransferID = this.finDetails[i].FinTransferID;
        this.Detmodel.RecordDate = this.finDetails[i].RecordDate;
        this.Detmodel.RecYear = this.finDetails[i].RecYear;
        this.Detmodel.SerialNo = this.finDetails[i].SerialNo;
        this.Detmodel.ModelID = this.finDetails[i].ModelID;
        this.Detmodel.ColorID = this.finDetails[i].ColorID;
        this.Detmodel.Quantity = this.finDetails[i].Quantity;
        this.Detmodel.BatchNo = this.finDetails[i].BatchNo;
        this.Detmodel.StoreTypeID = this.finDetails[i].StoreTypeID;
        this.Detmodel.StoreType = this.finDetails[i].StoreType;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/finEqul', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
    StartSearch() {
        if(! this.selModID) return
        this.srvTrns.searchModelCode(this.selModID).subscribe(cols => this.collection = cols, err => hf.handleError(err))
    }
    ResetSearch() {
        this.reset = true
        this.selModID = undefined
        this.srvTrns.getTransfer().subscribe(cols => this.collection = cols, err => hf.handleError(err), () => this.reset = false)
    }
    modSearchSelect(value) {
        this.selModID = value
    }
}
