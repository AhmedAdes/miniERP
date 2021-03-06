import { Component, OnInit, Input } from '@angular/core';
import { ModelColor, CurrentUser } from '../../../../Models';
import { ColorPickerService } from 'ngx-color-picker';

@Component({
    selector: 'prod-color',
    templateUrl: './prod-color.html'
})
export class ColorComponent implements OnInit {
    @Input() colorList: ModelColor[];
    @Input() currentUser: CurrentUser;

    srchObj: ModelColor = new ModelColor();

    constructor(private cpService: ColorPickerService) { }

    ngOnInit() { }

    DeleteColor(i: number) {
        this.colorList.splice(i, 1);
    }
}