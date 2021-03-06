import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, FinReturnService, FinDetailService, ModelService, SalesHeaderService } from '../../../services';
import { CurrentUser, FinishedReturn, FinishedStoreDetail, SalesHeader, Model } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CompleterService, CompleterData, CompleterItem } from "ng2-completer";
import * as hf from '../../helper.functions'

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
    currentUser: CurrentUser = this.auth.getUser()
    collection: FinishedReturn[] = []
    finDetails: FinishedStoreDetail[] = []
    modelsList: any[]
    SOList: SalesHeader[] = []
    model: FinishedReturn = new FinishedReturn()
    Detmodel: FinishedStoreDetail = new FinishedStoreDetail()
    srchObj: FinishedReturn = new FinishedReturn()
    showTable: boolean
    Formstate: string
    headerText: string
    errorMessage: string
    orderbyString: string = ""
    orderbyClass: string = "fa fa-sort"
    cnvRecDate: string
    basicform: FormGroup
    stillSaving: boolean
    SOIDList: CompleterData
    selModID: number
    reset: boolean

    //RecYear ,SerialNo ,ReturnDate ,ReturnFrom ,ReturnReason ,UserID
    constructor(public srvRet: FinReturnService, private auth: AuthenticationService, private srvCmp: CompleterService,
        private srvDet: FinDetailService, private srvModel: ModelService, private srvSO: SalesHeaderService,
        fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            RecDate: ['', Validators.required],
            soID: [''],
            autoSoID: [''],
            RetFrom: ['', Validators.required],
            RetReason: ['', Validators.required]
        });

        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        this.basicform.controls['soID'].valueChanges.subscribe(value => this.onSOIDchange(value));
        // this.basicform.controls['ReturnType'].valueChanges.subscribe(value => this.onchkchange(value));
    }

    ngOnInit() {
        this.srvRet.getReturn().subscribe(cols => {
            this.collection = cols;
            this.srvModel.getModelwithColors().subscribe(mod => {
                this.modelsList = mod;
                this.srvSO.getFinishedSalesHeader().subscribe(so => {
                  this.SOList = so;
                  this.SOIDList = this.srvCmp.local(so, "SOID", "SOID").descriptionField("CustName")
                });
                this.TableBack();
            })
        });
    }

    CreateNew() {
        this.model = new FinishedReturn();
        this.cnvRecDate = this.model.ReturnDate ? hf.handleDate(new Date(this.model.ReturnDate)) : hf.handleDate(new Date());
        // this.srvDet.getFinRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Finished Store Return';
        // })
    }
    LoadDetails(id, state) {
        this.srvRet.getReturn(id).subscribe(mat => {
            this.model = mat[0];
            this.srvDet.getFinRetDetail(id).subscribe(det => {
                this.finDetails = det;
                this.cnvRecDate = this.model.ReturnDate ? hf.handleDate(new Date(this.model.ReturnDate)) : hf.handleDate(new Date());
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
            hf.handleError('Must Add some Products First')
            this.stillSaving = false
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.srvRet.insertReturn(this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.srvRet.updateReturn(this.model.FinReturnID, this.model, this.finDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.srvRet.deleteReturn(this.model.FinReturnID).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
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
            this.model.ReturnDate = value;
        }
    }
    onSOIDchange(value) {
        if (!value) { return }
        this.srvSO.getSalesModels(value).subscribe(mo => {
            this.Detmodel = new FinishedStoreDetail()
            this.modelsList = mo
            var selSo = this.SOList.filter(so => so.SOID == value)[0]
            this.model.ReturnFrom = selSo.CustName + ' ' + selSo.ContactPerson
        })
    }
    SOIDSelected(selected){
      if (selected) {
          this.model.SOID = selected
      } else {
          this.model.SOID = null;
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
        this.Detmodel.StoreTypeID = this.finDetails[i].StoreTypeID;
        this.Detmodel.StoreType = this.finDetails[i].StoreType;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/finRet', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
    StartSearch() {
        if (!this.selModID) return
        this.srvRet.searchModelCode(this.selModID).subscribe(cols => this.collection = cols, err => hf.handleError(err))
    }
    ResetSearch() {
        this.reset = true
        this.selModID = undefined
        this.srvRet.getReturn().subscribe(cols => this.collection = cols, err => hf.handleError(err), () => this.reset = false)
    }
    modSearchSelect(value) {
        this.selModID = value
    }
}
