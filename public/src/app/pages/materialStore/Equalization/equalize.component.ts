import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, MatEqualizeService, MatDetailService, MaterialService, AccessoryService } from '../../../services';
import { CurrentUser, MaterialEqualization, MaterialStoreDetail, Material, EqualizeTypes } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as hf from '../../helper.functions'

@Component({
    selector: 'mat-Equalize',
    templateUrl: './equalize.component.html',
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
export class MatEqualizeComponent implements OnInit {
    //RecYear ,SerialNo ,EqualizeDate ,EqualizeType ,UserID
    constructor(public srvEqul: MatEqualizeService, private auth: AuthenticationService,
        private srvDet: MatDetailService, private srvMat: MaterialService, private srvAcc: AccessoryService,
        fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            RecDate: ['', Validators.required],
            EqType: ['', Validators.required]
        });

        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        // this.basicform.controls['EqualizeType'].valueChanges.subscribe(value => this.onchkchange(value));
    }

    currentUser: CurrentUser = this.auth.getUser();
    collection: MaterialEqualization[] = [];
    matDetails: MaterialStoreDetail[] = [];
    materialList: Material[];
    equalizeList = EqualizeTypes;
    model: MaterialEqualization = new MaterialEqualization();
    Detmodel: MaterialStoreDetail = new MaterialStoreDetail();
    srchObj: MaterialEqualization = new MaterialEqualization();
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
        this.srvEqul.getEqualize().subscribe(cols => {
            this.collection = cols;
            this.TableBack();
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
    CreateNew(mat: string) {
        this.model = new MaterialEqualization();
        if (mat == 'Cloth') {
            this.srvMat.getCloth().subscribe(ret => { this.materialList = ret; this.ContinueNew(); this.model.Category = mat})
        } else {
            this.srvAcc.getAccessory().subscribe(ret => { this.materialList = ret; this.ContinueNew(); this.model.Category = mat})
        }

        // })
    }
    ContinueNew() {
        this.cnvRecDate = this.model.EqualizeDate ? this.HandleDate(new Date(this.model.EqualizeDate)) : this.HandleDate(new Date());
        // this.srvDet.getMatRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Material Store Equalize';
    }
    LoadDetails(id, state) {
        this.srvEqul.getEqualize(id).subscribe(mat => {
            if (mat[0].Category == 'Cloth') {
                this.srvMat.getCloth().subscribe(ret => { this.materialList = ret; this.LoadDetails2(id, state, mat) })
            } else {
                this.srvAcc.getAccessory().subscribe(ret => { this.materialList = ret; this.LoadDetails2(id, state, mat) })
            }
        });
    }
    LoadDetails2(id, state, mat) {
        this.model = mat[0];
        this.srvDet.getMatEqualDetail(id).subscribe(det => {
            this.matDetails = det;
            this.cnvRecDate = this.model.EqualizeDate ? this.HandleDate(new Date(this.model.EqualizeDate)) : this.HandleDate(new Date());
            this.showTable = false;
            this.Formstate = state;
            this.headerText = state == 'Detail' ? `Material Store Equalize ${state}s` : `${state} Material Store Equalize`;
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
        this.model = new MaterialEqualization();
        this.Detmodel = new MaterialStoreDetail();
        this.matDetails = [];
        this.stillSaving = false
        this.basicform.reset();
    }
    HandleForm(event) {
        event.preventDefault();
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID;
        this.model.RecYear = new Date().getFullYear();
        if (this.matDetails.length == 0) {
            hf.handleError('Must Add some Products First')
            this.stillSaving = false
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.srvEqul.insertEqualize(this.model, this.matDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.srvEqul.updateEqualize(this.model.MatEqualizeID, this.model, this.matDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.srvEqul.deleteEqualize(this.model.MatEqualizeID).subscribe(ret => {
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
            this.model.EqualizeDate = value;
        }
    }
    DeleteDetail(i: number) {
        this.matDetails.splice(i, 1);
    }
    EditDetail(i: number) {
        this.Detmodel = new MaterialStoreDetail()
        this.Detmodel.MatStoreID = this.matDetails[i].MatStoreID;
        this.Detmodel.MatEqualizeID = this.matDetails[i].MatEqualizeID;
        this.Detmodel.RecordDate = this.matDetails[i].RecordDate;
        this.Detmodel.RecYear = this.matDetails[i].RecYear;
        this.Detmodel.SerialNo = this.matDetails[i].SerialNo;
        this.Detmodel.MaterialID = this.matDetails[i].MaterialID;
        this.Detmodel.Quantity = this.matDetails[i].Quantity;
        this.Detmodel.QCNO = this.matDetails[i].QCNO;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/matEqul', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
}
