import { Component, OnInit, Input, trigger, state, style, transition, animate } from '@angular/core';
import { ImageResult } from 'ng2-imageupload';
import { AuthenticationService, ModelService, BrandService, ColorService, SizeService } from '../../services';
import { Brand, Model, CurrentUser, ModelColor, ModelSize } from '../../Models';

@Component({
    selector: 'app-model',
    templateUrl: './model.component.html',
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
export class ModelComponent implements OnInit {

    constructor(public serv: ModelService, private auth: AuthenticationService,
        private brandServ: BrandService, private clrServ: ColorService, private sizeServ: SizeService) { }

    currentUser: CurrentUser = this.auth.getUser();
    collection: Model[] = [];
    model: Model;
    srchObj: Model = new Model();
    showTable: boolean;
    Formstate: string;
    headerText: string;
    BrandList: Brand[] = [];
    colorList: ModelColor[] = [];
    sizeList: ModelSize[] = [];
    errorMessage: string;
    orderbyString: string = "";
    orderbyClass: string = "fa fa-sort";

    ngOnInit() {
        this.serv.getModel().subscribe(cols => {
            this.collection = cols;
            this.brandServ.getBrand().subscribe(set => {
                this.BrandList = set; this.TableBack();
            });
        });
    }

    selected(imageResult: ImageResult) {
        this.model.SelectedProductImgSrc = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
    }

    CreateNew() {
        this.model = new Model();
        this.model.SelectedProductImgSrc = "./assets/img/Unknown Avatar.png";
        this.sizeServ.getSize().subscribe(siz => {
            this.sizeList = siz;
            this.showTable = false;
            this.Formstate = 'Create';
            this.headerText = 'Create New Model';
        })
    }

    EditThis(id: number) {
        this.serv.getModel(id).subscribe(mat => {
            this.model = mat[0];
            this.model.SelectedProductImgSrc = this.model.Photo != null ?
                `data:image/gif;base64,${this.model.SelectedProductImgSrc}` : "./assets/img/Unknown Avatar.png";

            this.clrServ.getColor(id).subscribe(clr => {
                this.colorList = clr;
                this.sizeServ.getSize(id).subscribe(siz => {
                    this.sizeList = siz;
                    this.showTable = false;
                    this.Formstate = 'Edit';
                    this.headerText = 'Edit Model';
                });
            });
        });
    }
    ShowDetails(id: number) {
        this.serv.getModel(id).subscribe(mat => {
            this.model = mat[0];
            this.model.SelectedProductImgSrc = this.model.Photo != null ?
                `data:image/gif;base64,${this.model.SelectedProductImgSrc}` : "./assets/img/Unknown Avatar.png";
            this.clrServ.getColor(id).subscribe(clr => {
                this.colorList = clr;
                this.sizeServ.getSize(id).subscribe(siz => {
                    this.sizeList = siz;
                    this.showTable = false;
                    this.Formstate = 'Detail';
                    this.headerText = 'Model Details';
                });
            });
        });
    }
    Delete(id: number) {
        this.serv.getModel(id).subscribe(mat => {
            this.model = mat[0];
            this.model.SelectedProductImgSrc = this.model.Photo != null ?
                `data:image/gif;base64,${this.model.SelectedProductImgSrc}` : "./assets/img/Unknown Avatar.png";
            this.clrServ.getColor(id).subscribe(clr => {
                this.colorList = clr;
                this.sizeServ.getSize(id).subscribe(siz => {
                    this.sizeList = siz;
                    this.showTable = false;
                    this.Formstate = 'Delete';
                    this.headerText = 'Delete Model';
                });
            });
        });
    }
    TableBack() {
        this.showTable = true;
        this.Formstate = null;
        this.headerText = 'Models';
        this.errorMessage = null;
        this.model = new Model();
        this.colorList = [];
        this.sizeList = [];
    }
    HandleForm(event) {
        event.preventDefault();
        this.model.UserID = this.currentUser.userID;
        this.model.Photo = document.getElementById("ImgProduct").getAttribute("src") === "./assets/img/Unknown Avatar.png" ? null : document.getElementById("ImgProduct").getAttribute("src").split(",")[1]
        var newSizeList = this.sizeList.filter(obj => obj.Selected == true);
        switch (this.Formstate) {
            case 'Create':
                this.serv.insertModel(this.model, this.colorList, newSizeList).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Edit':
                this.serv.updateModel(this.model.ModelID, this.model, this.colorList, newSizeList).subscribe(ret => {
                    if (ret.error) {
                        this.errorMessage = ret.error.message;
                    } else if (ret.affected > 0) {
                        this.ngOnInit();
                    }
                }, err => this.errorMessage = err.message);
                break;
            case 'Delete':
                this.serv.deleteModel(this.model.ModelID).subscribe(ret => {
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
    AddNewColor() {
        this.colorList.push(new ModelColor());
    }

    DeleteColor(i: number) {
        this.colorList.splice(i, 1);
    }
}

interface FileReaderEventTarget extends EventTarget {
    result: string
}

interface FileReaderEvent extends Event {
    target: FileReaderEventTarget;
    getMessage(): string;
}