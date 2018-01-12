import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Util, FarmService, SensorService, AreaService } from '../../services/index';
import { CreateOrUpdateSensorComponent } from "./create-or-update/create-or-update.component";
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';
import { debounce } from 'rxjs/operator/debounce';

@Component({
  selector: 'sensor',
  styleUrls: ['./sensor.scss'],
  templateUrl: './sensor.html'
})
export class Sensor {

  private frm: FormGroup;
  public sortByList: any;
  public farms: any;
  public areas: any;
  private data: any;
  private pagingInfo: any;
  private types: any;

  constructor(private _modalService: NgbModal, private _farmService: FarmService, private _areaService: AreaService,
    private _util: Util, private _translate: TranslateService, private _sensorService: SensorService, private _fb: FormBuilder, ) {
    this.data = { total: 0, sensors: [] };
    this.pagingInfo = { pageIndex: 1, pageSize: 10 };
  }

  public ngOnInit(): void {
    this.frm = this._fb.group({
      name: [''],
      sensorType: [''],
      farmId: [''],
      areaId: [''],
      sortBy: [''],
      ascending: ['true'],
    });

    this._sensorService.getTypes().subscribe(typeResp => {
      this._farmService.getAll().subscribe(farmResp => {
        this._sensorService.getSortByList().subscribe(resp => {
          this.types = typeResp.data;
          this.farms = farmResp.data;
          this.sortByList = resp.data;
          if (this.sortByList.length) {
            this.frm.patchValue({ sortBy: this.sortByList[0].key });
          }
          this.refreshData();
        });
      });
    });

  }

  public onSubmit(): void {
    this.pagingInfo.pageIndex = 1;
    this.refreshData();
  }

  public refreshData(): void {
    let obj = {
      ...this.frm.value,
      pageIndex: this.pagingInfo.pageIndex,
      pageSize: this.pagingInfo.pageSize
    }
    let params = this._util.objectToURLSearchParams(obj);
    this._sensorService.search(params).subscribe(resp => {
      this.data = resp.data;
    });
  }

  /**
   * Show modal add sensor
   */
  public showModalAddSensor() {
    let modalRef = this._modalService.open(CreateOrUpdateSensorComponent, { backdrop: 'static', size: 'lg', keyboard: false });
    modalRef.componentInstance.title = "Add New Sensor";
    modalRef.componentInstance.farms = this.farms;
    modalRef.componentInstance.types = this.types;
    modalRef.result.then(data => {
      if (data) {
        this.refreshData();
      }
    }, (err) => { });
  }

  /**
   * Show modal edit sensor
   * @param id 
   */
  public showModalEditSensor(id: string): void {
    this._sensorService.getById(id).subscribe(sensorResp => {
      let modalRef = this._modalService.open(CreateOrUpdateSensorComponent, { backdrop: 'static', size: 'lg', keyboard: false });
      modalRef.componentInstance.title = "Update Sensor";
      modalRef.componentInstance.sensor = sensorResp.data;
      modalRef.componentInstance.farms = this.farms;
      modalRef.componentInstance.types = this.types;
      modalRef.result.then(data => {
        if (data) {
          this.refreshData();
        }
      }, (err) => { });
    });
  }

  /**
   * delete an sensor by id
   * @param id 
   */
  public deleteSensor(id: string): void {
    this._translate.get('modal.delete_sensor').subscribe((msg: string) => {
      let modalRef = this._modalService.open(ConfirmDialogComponent, {
        keyboard: true,
        backdrop: 'static'
      });
      modalRef.componentInstance.title = "Delete Sensor";
      modalRef.componentInstance.message = msg;
      modalRef.componentInstance.btnOk = "Delete";
      modalRef.result.then((result: boolean) => {
        if (result) {
          this._sensorService.delete(id).subscribe(resp => {
            this.refreshData();
          });
        }
      }, (err) => { });
    });
  }

  farmOnChange(farmId: string) {
    if (farmId) {
      this._areaService.getByFarm(farmId).subscribe(resp => {
        this.areas = resp.data;
      });
    } else {
      this.areas = [];
    }
  }

}
