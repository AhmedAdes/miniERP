import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Model } from '../../../Models'
import { ModelService } from '../../../services'

@Component({
    selector: 'app-mod-select',
    templateUrl: 'modSelect.component.html'
})

export class ModelSelectComponent implements OnInit, OnChanges {
    @Input() modelIDsList: any[]
    @Input() modelsList: Model[]
    @Input() submitted: boolean
    @Input() required: boolean
    @Input() reset: boolean
    modelCode: string
    modelID: number
    @Output() modelSelected = new EventEmitter()

    constructor(private srvMod: ModelService) { }

    ngOnInit() {
        if (!this.modelsList) {
            this.srvMod.getModel().subscribe(mod => {
                this.modelsList = mod
            })
        }
        if (!this.modelIDsList) {
            if (this.modelsList) {
                this.modelIDsList = this.modelsList.map(m => { return m.ModelCode })
            }
        }
    }
    ngOnChanges() {
        if (!this.modelIDsList) {
            if (this.modelsList) {
                this.modelIDsList = this.modelsList.map(m => { return m.ModelCode })
            }
        }
        if (this.reset) {
            this.modelCode = null
            this.modelID = null
        }
    }
    IDSelected(selected) {
        if (selected) {
            this.modelID = this.modelsList.find(m => m.ModelCode == selected.title).ModelID
            this.modelSelected.emit(this.modelID)
        } else {
            this.modelID = null;
        }
    }
    onProdChange(obj) {
        this.modelID = +obj.target.value
        this.modelCode = this.modelsList.find(obj => obj.ModelID == this.modelID).ModelCode;
        this.modelSelected.emit(this.modelID)
    }
}