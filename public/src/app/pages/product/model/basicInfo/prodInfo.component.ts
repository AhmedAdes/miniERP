import { Component, OnInit, Input } from '@angular/core';
import { Model, Brand, WashType, CurrentUser } from '../../../../Models';
import { ResizeOptions, ImageResult } from 'ng2-imageupload';

@Component({
    selector: 'prod-info',
    templateUrl: './prodInfo.component.html'
})
export class ProdInfoComponent implements OnInit {
    @Input() model: Model;
    @Input() BrandList: Brand[];
    @Input() WashList: WashType[];
    @Input() currentUser: CurrentUser;
    srchObj: Model = new Model();
    zoomedImageSrc

    resizeOptions: ResizeOptions = {
        resizeMaxHeight: 180,
        resizeMaxWidth: 180
    };

    constructor() { }

    ngOnInit() { }


    selected(imageResult: ImageResult) {
        this.zoomedImageSrc = imageResult.dataURL
        this.model.SelectedProductImgSrc = imageResult.resized
            && imageResult.resized.dataURL
            || imageResult.dataURL;
    }

}