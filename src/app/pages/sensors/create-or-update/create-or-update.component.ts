import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from "../../../theme/validators/equalPasswords.validator";
import { NgUploaderOptions } from 'ngx-uploader';

import { AreaService, SensorService } from '../../../services/index';
import { AppSetting } from '../../../app.setting';

@Component({
    selector: 'create-or-update-farm',
    styleUrls: [('./create-or-update.component.scss')],
    templateUrl: './create-or-update.component.html'
})

export class CreateOrUpdateSensorComponent implements OnInit {

    @ViewChild('mytab')
    mytab: NgbTabset

    public title: string;
    public sensor: any;
    public farms: any[];
    public areas: any[];
    public types: any[];

    private frm: FormGroup;
    private name: AbstractControl;
    private farmId: AbstractControl;
    private areaId: AbstractControl;
    private sensorType: AbstractControl;
    private locationX: AbstractControl;
    private locationY: AbstractControl;

    constructor(private _fb: FormBuilder, private activeModal: NgbActiveModal,
        private _areaService: AreaService, private _sensorService: SensorService) {

    }

    ngOnInit() {
        this.frm = this._fb.group({
            name: ['', Validators.required],
            sensorType: ['', Validators.required],
            farmId: [''],
            areaId: [''],
            locationX: [''],
            locationY: [''],
        });
        debugger;
        this.name = this.frm.controls['name'];
        this.sensorType = this.frm.controls['sensorType'];
        this.farmId = this.frm.controls['farmId'];
        this.areaId = this.frm.controls['areaId'];
        this.locationX = this.frm.controls['locationX'];
        this.locationY = this.frm.controls['locationY'];

        if (this.sensor && this.sensor.id) {
            this.frm.patchValue(this.sensor);
        }
    }

    public onSubmit(values: Object): void {
        if (this.frm.valid) {
            let value = this.frm.value;
            let data: any = {
                ...this.frm.value,
            }

            if (this.sensor && this.sensor.id) {
                this._sensorService.update(this.sensor.id, data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            } else {
                this._sensorService.create(data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            }
        } else {
            this.frm.controls['name'].markAsDirty();
            this.frm.controls['sensorType'].markAsDirty();
            this.focusOnInvalidTab();
        }
    }

    private focusOnInvalidTab(): void {
        if (this.name.invalid || this.sensorType.invalid) {
            this.mytab.select('infoTab');
        }
    }

    farmOnChange(farmId: string) {
        this._areaService.getByFarm(farmId).subscribe(resp => {
            this.areas = resp.data;
        });
    }

    closeModal() {
        this.activeModal.close();
    }
}