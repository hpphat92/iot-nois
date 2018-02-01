import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from "../../../theme/validators/equalPasswords.validator";
import { NgUploaderOptions } from 'ngx-uploader';

import { AreaService, SensorService } from '../../../services/index';
import { AppSetting } from '../../../app.setting';
import { debounce } from 'rxjs/operator/debounce';

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
  public initialData: any = {};

  private frm: FormGroup;
  private id: AbstractControl;
  private name: AbstractControl;
  private farmId: AbstractControl;
  private areaId: AbstractControl;
  private sensorType: AbstractControl;
  private locationX: AbstractControl;
  private locationY: AbstractControl;
  private warningInMinute: AbstractControl;
  private minWarning: AbstractControl;
  private maxWarning: AbstractControl;
  private secondMinWarning: AbstractControl;
  private secondMaxWarning: AbstractControl;

  constructor(private _fb: FormBuilder, private activeModal: NgbActiveModal,
    private _areaService: AreaService, private _sensorService: SensorService) {

  }

  ngOnInit() {
    this.initialData = this.initialData || {};
    this.frm = this._fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      sensorType: ['', Validators.required],
      farmId: [''],
      areaId: [{ value: '', disabled: true }],
      locationX: [{ value: this.initialData.locationX || 0, disabled: true }],
      locationY: [{ value: this.initialData.locationY || 0, disabled: true }],
      warningInMinute: [''],
      minWarning: [''],
      maxWarning: [''],
      secondMinWarning: [''],
      secondMaxWarning: [''],
    });
    this.id = this.frm.controls['id'];
    this.name = this.frm.controls['name'];
    this.sensorType = this.frm.controls['sensorType'];
    this.farmId = this.frm.controls['farmId'];
    this.areaId = this.frm.controls['areaId'];
    this.locationX = this.frm.controls['locationX'];
    this.locationY = this.frm.controls['locationY'];
    this.warningInMinute = this.frm.controls['warningInMinute'];
    this.minWarning = this.frm.controls['minWarning'];
    this.maxWarning = this.frm.controls['maxWarning'];
    this.secondMinWarning = this.frm.controls['secondMinWarning'];
    this.secondMaxWarning = this.frm.controls['secondMaxWarning'];

    if (this.initialData.farmId) {
      this.frm.patchValue(this.initialData);
    }
    if (this.sensor && this.sensor.id) {
      this.frm.patchValue(this.sensor);
      this.frm.patchValue({ farmId: this.sensor.area.farmId });
      this._areaService.getByFarm(this.sensor.area.farmId).subscribe(resp => {
        this.areas = resp.data;
        this.frm.patchValue({ areaId: this.sensor.area.id, sensorType: this.sensor.sensorType.id });
        this.areaId.enable();
        this.locationX.enable();
        this.locationY.enable();
      });
    } else {
      if (this.initialData.farmId) {
        this._areaService.getByFarm(this.initialData.farmId).subscribe(resp => {
          this.areas = resp.data;
          this.areaId.enable();
          this.locationX.enable();
          this.locationY.enable();
        });
      }
    }
  }

  public onSubmit(values: Object): void {
    if (this.frm.valid) {
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
    if (farmId) {
      this.areaId.enable();
      this._areaService.getByFarm(farmId).subscribe(resp => {
        this.areas = resp.data;
      });
    } else {
      this.areas = [];
      this.frm.patchValue({ areaId: '' });
    }
  }

  areaOnChange(areaId: string) {
    if (areaId) {
      this.locationX.enable();
      this.locationY.enable();
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}
