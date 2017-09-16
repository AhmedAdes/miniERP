import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, MatReceivingService, MatInspectionService, MatDetailService, MaterialService, AccessoryService } from '../../../services';
import { CurrentUser, MaterialReceiving, MaterialStoreDetail, MaterialInspection, Material } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'mat-rec',
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
export class MatReceivingComponent implements OnInit {

    currentUser: CurrentUser = this.auth.getUser();
    collection: MaterialReceiving[] = [];
    Pending: MaterialInspection[] = [];
    History: MaterialReceiving[] = [];
    matDetails: MaterialStoreDetail[] = [];
    materialList: Material[];
    model: MaterialReceiving = new MaterialReceiving();
    Detmodel: MaterialStoreDetail = new MaterialStoreDetail();
    srchPend: MaterialInspection = new MaterialInspection();
    srchObj: MaterialReceiving = new MaterialReceiving();
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

    constructor(public srvRec: MatReceivingService, private srvInsp: MatInspectionService, private auth: AuthenticationService,
        private srvDet: MatDetailService, private srvMat: MaterialService, private srvAcc: AccessoryService,
        fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            ReceivingDate: ['', Validators.required],
            ManfDate: ['', Validators.required],
            BatchNo: [''],
            InvoiceNo: [''],
            InvoiceDate: [''],
            InspID: [''],
        });
        //RecYear ,SerialNo ,ReceivingDate ,ManfDate ,POID ,InvoiceNo ,InvoiceDate ,QCNO ,UserID ,InspID
        this.basicform.controls['ReceivingDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        this.basicform.controls['ManfDate'].valueChanges.subscribe(value => this.onManfDatechange(value));
    }

    ngOnInit() {
        this.srvRec.getReceiving().subscribe(cols => {
            this.History = cols;
            this.srvInsp.getPendingReciving().subscribe(pnd => {
                this.Pending = pnd;
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

    Receive(item: MaterialInspection) {
        this.model = new MaterialReceiving();
        this.model.InspID = item.InspID
        this.model.InvoiceNo = item.InvoiceNo
        this.model.InvoiceDate = item.InvoiceDate
        this.model.POID = item.POID
        this.model.ManfDate = item.ManfDate
        this.model.RecYear = new Date().getFullYear();

        var Det = new MaterialStoreDetail()
        Det.MaterialID = item.MaterialID; Det.MaterialName = item.MaterialName; Det.Unit = item.Unit;
        Det.Quantity = item.QtyApproved; Det.QCNO = item.QCNO; Det.SupName = item.SupName; Det.SupID = item.SupID;
        Det.QtyApproved = item.QtyApproved; Det.QtyReceived = item.QtyReceived;
        Det.RecYear = item.RecYear; Det.UserID = item.UserID; Det.UnitPrice = item.UnitPrice;
        Det.SupplierBatchNo = item.BatchNo; Det.RecordDate = new Date()
        this.matDetails.push(Det);

        this.cnvRecDate = this.model.ReceivingDate ? this.HandleDate(new Date(this.model.ReceivingDate)) : this.HandleDate(new Date());
        this.cnvManfDate = this.model.ManfDate ? this.HandleDate(new Date(this.model.ManfDate)) : this.HandleDate(new Date());
        if (item.Category == 'Cloth') {
            this.srvMat.getCloth().subscribe(ret => this.materialList = ret)
        } else {
            this.srvAcc.getAccessory().subscribe(ret => this.materialList = ret)
        }
        // this.srvDet.getMatRecDetail().subscribe(siz => {
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Material Store Receiving';
        // })
    }
    LoadDetails(id, state) {
        this.srvRec.getReceiving(id).subscribe(mat => {
            if (mat[0].Category == 'Cloth') {
                this.srvMat.getCloth().subscribe(ret => { this.materialList = ret; this.LoadDetails2(id, state, mat) })
            } else {
                this.srvAcc.getAccessory().subscribe(ret => { this.materialList = ret; this.LoadDetails2(id, state, mat) })
            }
        });
    }
    LoadDetails2(id, state, mat) {
        this.model = mat[0];
        this.srvDet.getMatRecDetail(id).subscribe(det => {
            this.matDetails = det;
            this.cnvRecDate = this.model.ReceivingDate ? this.HandleDate(new Date(this.model.ReceivingDate)) : this.HandleDate(new Date());
            this.cnvManfDate = this.model.ManfDate ? this.HandleDate(new Date(this.model.ManfDate)) : this.HandleDate(new Date());
            this.showTable = false;
            this.Formstate = state;
            this.headerText = state == 'Detail' ? `Material Store Receiving ${state}s` : `${state} Material Store Receiving`;
        });
    }
    EditThis(id: number) {
        this.LoadDetails(id, 'Edit');
    }
    ShowDetails(id: number) {
        this.LoadDetails(id, 'Detail');
    }
    PrintDetails(id: number){
        window.open(`#/printout/matRec/${id}`, '_blank')
    }
    Delete(id: number) {
        this.LoadDetails(id, 'Delete');
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.errorMessage = null;
        this.model = new MaterialReceiving();
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
        if (this.matDetails.length == 0) {
            this.errorMessage = "Must Add some Materials First";
            return;
        }
        switch (this.Formstate) {
            case 'Create':
                this.srvRec.insertReceiving(this.model, this.matDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.srvRec.updateReceiving(this.model.MatReceivingID, this.model, this.matDetails).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.srvRec.deleteReceiving(this.model.MatReceivingID).subscribe(ret => {
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
            this.model.ReceivingDate = value;
        }
    }
    onManfDatechange(value) {
        if (value) {
            this.model.ManfDate = value;
        }
    }

    DeleteDetail(i: number) {
        this.matDetails.splice(i, 1);
    }
    EditDetail(i: number) {
        this.Detmodel = new MaterialStoreDetail()
        this.Detmodel.MatStoreID = this.matDetails[i].MatStoreID;
        this.Detmodel.MatReceivingID = this.matDetails[i].MatReceivingID;
        this.Detmodel.RecordDate = this.matDetails[i].RecordDate;
        this.Detmodel.RecYear = this.matDetails[i].RecYear;
        this.Detmodel.SerialNo = this.matDetails[i].SerialNo;
        this.Detmodel.MaterialID = this.matDetails[i].MaterialID;
        this.Detmodel.Quantity = this.matDetails[i].Quantity;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/matRec', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }
}