import { Component, OnInit, Input } from '@angular/core';
import { ModelSize, CurrentUser } from '../../../../Models';

@Component({
    selector: 'prod-size',
    templateUrl: './prod-size.html'
})
export class SizeComponent implements OnInit {
    @Input() sizeList: ModelSize[];
    @Input() currentUser: CurrentUser;
    srchObj: ModelSize = new ModelSize();

    constructor() { }

    ngOnInit() {}

    checkChanged(item: ModelSize){
        item.QuntPerDozen = 1;
    }
}