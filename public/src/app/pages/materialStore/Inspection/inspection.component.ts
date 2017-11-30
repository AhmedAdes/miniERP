import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { AuthenticationService, MatInspectionService, MaterialService, AccessoryService, SupplierService } from '../../../services';
import { CurrentUser, MaterialReceiving, MaterialInspection, MaterialStoreDetail, Material, Supplier } from '../../../Models';
import { Form, FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { min, max } from '../../../pipes/validators'
import { Router } from '@angular/router';
import * as hf from '../../helper.functions'

@Component({
    selector: 'mat-insp',
    templateUrl: './inspection.component.html',
    styles: [`a.nav-link {
        font-size:18px!important
      }`],
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
export class MatInspectionComponent implements OnInit {
    currentUser: CurrentUser = this.auth.getUser();
    collection: MaterialInspection[] = [];
    Pending: MaterialInspection[] = [];
    History: MaterialInspection[] = [];
    suppliers: Supplier[] = [];
    materials: Material[] = [];
    model: MaterialInspection = new MaterialInspection();
    srchPend: MaterialInspection = new MaterialInspection();
    srchObj: MaterialInspection = new MaterialInspection();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";
    cnvRecDate: string;
    cnvManfDate: string;
    basicform: FormGroup;
    rlsform: FormGroup;
    stillSaving: boolean

    constructor(private srvInsp: MatInspectionService, private srvSup: SupplierService, private srvMat: MaterialService,
        private srvAcc: AccessoryService, private auth: AuthenticationService, fb: FormBuilder, private router: Router) {
        this.basicform = fb.group({
            // RecDate ,RecYear ,SerialNo ,ManfDate ,InvoiceNo ,InvoiceDate ,BatchNo ,QCNO ,MaterialID ,QtyReceived ,SampleQty ,UnitPrice ,TotalPrice ,Notes ,POID ,SupID ,UserID
            RecDate: ['', Validators.required],
            ManfDate: ['', Validators.required],
            InvoiceNo: [''],
            InvoiceDate: [''],
            BatchNo: [''],
            Unit: [{ value: '', readonly: true }],
            QtyReceived: ['', Validators.compose([Validators.required, min(0)])],
            SampleQty: ['', Validators.compose([min(0)])],
            UnitPrice: ['', [Validators.required, min(0)]],
            TotalPrice: [{ value: '', readonly: true }],
            Notes: [''],
            SupID: ['', Validators.required],
            MaterialID: ['', Validators.required]
        })
        this.basicform.controls['RecDate'].valueChanges.subscribe(value => this.onRecDatechange(value));
        this.basicform.controls['ManfDate'].valueChanges.subscribe(value => this.onManfDatechange(value));
        this.basicform.controls['MaterialID'].valueChanges.subscribe(value => this.onMaterialChange(value));
        this.basicform.controls['UnitPrice'].valueChanges.subscribe(value => this.TotalPriceChange(value));


        this.rlsform = fb.group({
            Approved: [''],
            QtyApproved: ['', Validators.compose([min(0)])],
            Reject: [''],
            QtyReject: ['', Validators.compose([min(0)])],
            Notes: ['']
        })
        this.rlsform.controls['Approved'].valueChanges.subscribe(value => this.onApprovechange(value));
        this.rlsform.controls['Reject'].valueChanges.subscribe(value => this.onRejectchange(value));
        this.rlsform.controls['QtyApproved'].valueChanges.subscribe(value => this.ChangeApproved());

    }

    ngOnInit() {
        this.srvInsp.getInspection().subscribe(col => {
            this.collection = col
            this.Pending = this.collection.filter(pen => pen.ReceivedApp == false && pen.ReceivedRej == false)
            this.History = this.collection.filter(his => his.ReceivedApp == true || his.ReceivedRej == true)
            this.srvSup.getSupplier().subscribe(sup => {
                this.suppliers = sup;
                this.TableBack();
            })
        })
    }

    CreateNew(mat: string) {
        this.model = new MaterialInspection();
        this.cnvRecDate = this.model.RecDate ? this.HandleDate(new Date(this.model.RecDate)) : this.HandleDate(new Date());
        this.cnvManfDate = this.model.ManfDate ? this.HandleDate(new Date(this.model.ManfDate)) : this.HandleDate(new Date());
        if (mat == 'Fabrics') {
            this.srvMat.getCloth().subscribe(ret => this.materials = ret)
        } else {
            this.srvAcc.getAccessory().subscribe(ret => this.materials = ret)
        }
        this.showTable = false;
        this.Formstate = 'Create';
        this.headerText = 'Create New Material Inspection';
    }

    LoadDetails(id, state) {
        this.srvInsp.getInspection(id).subscribe(mat => {
            if (mat[0].Category == 'Cloth') {
                this.srvMat.getCloth().subscribe(ret => { this.materials = ret; this.LoadDetails2(id, state, mat) })
            } else {
                this.srvAcc.getAccessory().subscribe(ret => { this.materials = ret; this.LoadDetails2(id, state, mat) })
            }
        });
    }
    LoadDetails2(id, state, mat) {
        this.model = mat[0];
        this.cnvRecDate = this.model.RecDate ? this.HandleDate(new Date(this.model.RecDate)) : this.HandleDate(new Date());
        this.cnvManfDate = this.model.ManfDate ? this.HandleDate(new Date(this.model.ManfDate)) : this.HandleDate(new Date());
        this.rlsform.controls['QtyApproved'].setValidators(Validators.compose([min(0), max(this.model.QtyReceived - this.model.SampleQty)]))
        this.showTable = false;
        this.Formstate = state;
        this.headerText = state == 'Detail' ? `Material Inspection ${state}s` : `${state} Material Inspection`;
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
    Release(id: number) {
        this.LoadDetails(id, 'Release');
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Material Inspection';
        this.errorMessage = null;
        this.stillSaving = false
    }
    HandleForm(event) {
        event.preventDefault();
        if (this.stillSaving) return
        this.stillSaving = true
        this.model.UserID = this.currentUser.userID
        this.model.SampleQty = this.model.SampleQty == null ? 0 : this.model.SampleQty

        switch (this.Formstate) {
            case 'Create':
                this.model.RecYear = new Date().getFullYear();
                this.srvInsp.insertInspection(this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Edit':
                this.srvInsp.updateInspection(this.model.InspID, this.model).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Delete':
                this.srvInsp.deleteInspection(this.model.InspID).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message || ret.error.originalError.info.message ;
                        hf.handleError(ret.error)
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => hf.handleError(err));
                break;
            case 'Release':
                this.model.QCNO = +(this.model.RecYear.toString() + this.pad("000", this.model.SerialNo.toString(), true))
                this.srvInsp.ReleaseInspection(this.model.InspID, this.model).subscribe(ret => {
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
    pad(pad, str, padLeft) {
        if (typeof str === 'undefined')
            return pad;
        if (padLeft) {
            return (pad + str).slice(-pad.length);
        } else {
            return (str + pad).substring(0, pad.length);
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
            this.model.RecDate = value;
        }
    }
    onManfDatechange(value) {
        if (value) {
            this.model.ManfDate = value;
        }
    }
    onMaterialChange(value) {
        if (!value || this.materials.length == 0) { return }
        this.model.Unit = this.materials.filter(mat => mat.MaterialID == value)[0].Unit
    }
    onApprovechange(value) {
        if (value) {
            // this.model.Approved = event.target.checked
            var Sample = this.model.SampleQty == null ? 0 : this.model.SampleQty
            this.model.QtyApproved = this.model.QtyReceived - this.model.SampleQty
            this.ChangeApproved()
            this.rlsform.controls['QtyApproved'].enable();
            this.model.Reject = false
        }
    }
    ChangeApproved() {
        var Sample = this.model.SampleQty == null ? 0 : this.model.SampleQty
        var Approved = this.model.QtyApproved == null ? 0 : this.model.QtyApproved
        this.model.QtyReject = this.model.QtyReceived - Sample - Approved
    }
    onRejectchange(value) {
        if (value) {
            // this.model.Reject = event.target.checked
            this.model.QtyReject = this.model.QtyReceived - this.model.SampleQty
            this.model.QtyApproved = 0
            this.model.Approved = false
            this.rlsform.controls['QtyApproved'].disable();
        }
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

    TotalPriceChange(value) {
        if (!value) return
        // var unitPrice = this.model.UnitPrice == null ? 0 : this.model.UnitPrice;
        var QtyReceived = this.model.QtyReceived == null ? 0 : this.model.QtyReceived;
        this.model.TotalPrice = value * QtyReceived;
    }
    PrintOrder(orderID) {
        this.router.navigate(['printout/matInsp', orderID])

        // window.open(`#/printout/invoice/${soid}`, '_blank')
    }

}
