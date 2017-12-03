import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinReceivingService, FinDetailService, ModelService } from '../../../services';
import { CurrentUser, FinishedReceiving, FinishedStoreDetail, Model } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as hf from '../../helper.functions'

@Component({
    selector: 'fin-Rec',
    templateUrl: './receiving.component.html',
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
export class FinReceivingComponent implements OnInit {

    currentUser: CurrentUser = this.auth.getUser();
    collection: FinishedReceiving[] = [];
    finDetails: FinishedStoreDetail[] = [];
    modelsList: Model[];
    model: FinishedReceiving = new FinishedReceiving();
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail();
    srchObj: FinishedReceiving = new FinishedReceiving();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    cnvRecDate: string;
    cnvManfDate: string;
    basicform: FormGroup;
    stillSaving: boolean
    selModID: number
    reset: boolean

    constructor(public srvRec: FinReceivingService, private auth: AuthenticationService,
        private srvDet: FinDetailService, private srvModel: ModelService, fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            RecDate: ['', Validators.required],
            ManfDate: ['', Validators.required],
            BatchNo: ['', Validators.required],
            ReceivedFrom: ['', Validators.required]
        });

        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        this.basicform.controls['ManfDate'].valueChanges.subscribe(value => this.onManfDatechange(value));
    }

    ngOnInit() {
        this.srvRec.getReceiving().subscribe(cols => {
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
        this.model = new FinishedReceiving();
        this.cnvRecDate = this.model.ReceivingDate ? this.HandleDate(new Date(this.model.ReceivingDate)) : this.HandleDate(new Date());
        this.cnvManfDate = this.model.ManfDate ? this.HandleDate(new Date(this.model.ManfDate)) : this.HandleDate(new Date());
        // this.srvDet.getFinRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Finished Store Receiving';
        // })
    }
    LoadDetails(id, state) {
        this.srvRec.getReceiving(id).subscribe(mat => {
            this.model = mat[0];
            this.srvDet.getFinRecDetail(id).subscribe(det => {
                this.finDetails = det;
                this.cnvRecDate = this.model.ReceivingDate ? this.HandleDate(new Date(this.model.ReceivingDate)) : this.HandleDate(new Date());
                this.cnvManfDate = this.model.ManfDate ? this.HandleDate(new Date(this.model.ManfDate)) : this.HandleDate(new Date());
                this.showTable = false;
                this.Formstate = state;
                this.headerText = state == 'Detail' ? `Finished Store Receiving ${state}s` : `${state} Finished Store Receiving`;
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
        this.errorMessage = null;
        this.model = new FinishedReceiving();
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
        if (this.finDetails.length == 0) {
            hf.handleError('Must Add some Products First')
            this.stillSaving = false
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.model.RecYear = new Date().getFullYear();
                this.srvRec.insertReceiving(this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.srvRec.updateReceiving(this.model.FinReceivingID, this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.srvRec.deleteReceiving(this.model.FinReceivingID).subscribe(ret => {
                    if (ret.error) {
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
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
            this.model.ReceivingDate = value;
        }
    }
    onManfDatechange(value) {
        if (value) {
            this.model.ManfDate = value;
        }
    }

    DeleteDetail(i: number) {
        this.finDetails.splice(i, 1);
    }
    EditDetail(i: number) {
        this.Detmodel = new FinishedStoreDetail()
        this.Detmodel.FinStoreID = this.finDetails[i].FinStoreID;
        this.Detmodel.FinReceivingID = this.finDetails[i].FinReceivingID;
        this.Detmodel.RecordDate = this.finDetails[i].RecordDate;
        this.Detmodel.RecYear = this.finDetails[i].RecYear;
        this.Detmodel.SerialNo = this.finDetails[i].SerialNo;
        this.Detmodel.ModelID = this.finDetails[i].ModelID;
        this.Detmodel.ColorID = this.finDetails[i].ColorID;
        this.Detmodel.Quantity = this.finDetails[i].Quantity;
        this.Detmodel.StoreTypeID = this.finDetails[i].StoreTypeID;
        this.Detmodel.StoreType = this.finDetails[i].StoreType;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/finRec', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
    StartSearch() {
        if(! this.selModID) return
        this.srvRec.searchModelCode(this.selModID).subscribe(cols => this.collection = cols, err => hf.handleError(err))
    }
    ResetSearch() {
        this.reset = true
        this.selModID = undefined
        this.srvRec.getReceiving().subscribe(cols => this.collection = cols, err => hf.handleError(err), () => this.reset = false)
    }
    modSearchSelect(value) {
        this.selModID = value
    }
}
