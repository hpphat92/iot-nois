import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { Util, FarmService, SensorService,AreaService } from '../../services/index';
import { CreateOrUpdateSensorComponent } from "./create-or-update/create-or-update.component";
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog';

@Component({
  selector: 'sensor',
  styleUrls: ['./sensor.scss'],
  templateUrl: './sensor.html'
})
export class Sensor {

  private data: any;
  private pagingInfo: any;
  private types: any;
  private allFarms:any;


  constructor(private _modalService: NgbModal, private _farmService: FarmService,private _areaService: AreaService,
    private _util: Util, private _translate: TranslateService, private _sensorService: SensorService) {
    this.data = { total: 0, sensors: [] };
    this.pagingInfo = { pageIndex: 1, pageSize: 10 };
  }

  public ngOnInit(): void {
    try {
      this._sensorService.getTypes().subscribe(typeResp => {
        this.types = typeResp.data;
      });
      this._farmService.getAll().subscribe(farmResp => {
        this.allFarms = farmResp.data;
      });
      this.refreshData();
    }
    catch(e) {
      console.log(e);
    }
  }
  public refreshData(): void {
    let obj = {
      // ...this.frm.value,
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
    this._farmService.getAll().subscribe(farmResp => {  
      let modalRef = this._modalService.open(CreateOrUpdateSensorComponent, { backdrop: 'static', size: 'lg', keyboard: false });
      modalRef.componentInstance.title = "Add New Sensor";
      modalRef.componentInstance.farms = farmResp.data;
      modalRef.componentInstance.types = this.types;
      modalRef.result.then(data => {
        if (data) {
          this.refreshData();
        }
      }, (err) => { });
    });
  }

  /**
   * Show modal edit sensor
   * @param id 
   */
  public showModalEditSensor(id: string): void {
    let updateSensor=this.data.sensors.filter(x => x.id == id)[0];
    //this._sensorService.getById(id).subscribe(sensorResp => {
      //this._farmService.getAll().subscribe(farmResp => {
        let modalRef = this._modalService.open(CreateOrUpdateSensorComponent, { backdrop: 'static', size: 'lg', keyboard: false });
        modalRef.componentInstance.title = "Update Sensor";
        //modalRef.componentInstance.sensor = sensorResp.data;
        modalRef.componentInstance.sensor = updateSensor;
        modalRef.componentInstance.farms = this.allFarms;
        modalRef.componentInstance.types = this.types;
        modalRef.result.then(data => {
          if (data) {
            this.refreshData();
          }
        }, (err) => { });
      //});
    //});
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
}
