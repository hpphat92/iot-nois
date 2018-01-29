import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection } from '@aspnet/signalr-client/dist/src';
import { GlobalState } from '../../global.state';
import * as L from 'leaflet';
import 'leaflet-contextmenu';
import { AreaService, FarmService, HubService, SensorService } from '../../services';
import { CreateOrUpdateAreaComponent } from "../areas/create-or-update/create-or-update.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmDialogComponent } from "../../shared/components/confirm-dialog";
import { TranslateService } from "@ngx-translate/core";
import { CreateOrUpdateSensorComponent } from "../sensors/create-or-update/create-or-update.component";

@Component({
  selector: 'area-detail',
  styleUrls: ['./area-detail.scss'],
  templateUrl: './area-detail.html',
})
export class AreaDetail {

  private areaId: string;
  private area: any;
  private types: any;
  private overlay: any;
  private map: L.Map;
  private devices: any[];
  // Open Street Map definitions
  private LAYER_OSM = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Open Street Map',
  });
  // Values to bind to Leaflet Directive
  private options = {
    layers: [this.LAYER_OSM],
    zoom: 10,
    center: L.latLng(0, 0),
    // center: latLng(46.879966, -121.726909)
  };
  private markers: L.Layer[] = [];
  private interval: any;
  private farms: any[];
  private hubConnection: HubConnection;

  constructor(private route: ActivatedRoute, private _areaService: AreaService, private state: GlobalState,
              private _hubService: HubService, private _elementRef: ElementRef, private _sensorService: SensorService, private _farmService: FarmService, private _modalService: NgbModal, private _translate: TranslateService) {
  }

  public ngOnInit() {
    // get area id from url
    this.route.params.subscribe(params => {
      this.areaId = params['id'];
    });

    this.getSensorType();
    this.getFarmData();
    this._areaService.getById(this.areaId).subscribe(resp => {
      this.state.notifyDataChanged('menu.activeLink', {title: 'Area Detail'});
      this.area = resp.data;
      this.initMap(resp.data.photo);
    });
  }

  private getSensorType() {
    this._sensorService.getTypes().subscribe(typeResp => {
      this.types = typeResp.data;
    });
  }

  private getFarmData() {
    this._farmService.getAll().subscribe(farmResp => {
      this.farms = farmResp.data;
    });
  }

  private makeMaker(sensors: any) {
    sensors.forEach((item, i) => {
      const newMarker = L.marker(
        [-item.locationY, item.locationX],
        <any>{
          icon: L.icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: '../../../assets/img/antena_azul.png',
            shadowUrl: '../../../assets/img/marker-shadow.png',
          }),
          draggable: true,
          contextmenu: true,
          contextmenuInheritItems: false,
          contextmenuItems: [{
            text: 'Edit Sensor',
            callback: (e) => {
              this.showModalEditSensor(e, item.id);
            },
          }, {
            text: 'Delete Sensor',
            callback: () => {
              this.deleteSensor(item.id);
            },
          }]
        },
      )
        .bindPopup(`<div class="popup-name">${item.name} <em>${item.id}</em></div><div class="popup-name">${item.sensorType.name}</div>`)
        .on('click', (e) => {
          newMarker.openPopup();
        })
        .on('dragend', (e: any) => {
          const {lat, lng} = e.target.getLatLng();
          item.locationY = -lat;
          item.locationX = lng;
          this.updateSensor(item);
        });
      this.markers.push(newMarker);
      this.map.addLayer(newMarker);
    });
  }

  private updateSensor(sensor) {
    this._sensorService.update(sensor.id, {
      id: sensor.id,
      name: sensor.name,
      sensorType: sensor.sensorType.id,
      areaId: this.area.id,
      locationX: sensor.locationX,
      locationY: sensor.locationY,
    }).subscribe(resp => {
    });
  }

  private initMap(photoUrl) {
    if (!photoUrl) {
      return;
    }
    (new Promise((resolve) => {
      const img = new Image();
      img.src = photoUrl;
      img.onload = function () {
        resolve({
          width: (this as any).width,
          height: (this as any).height,
        });
      };
    }).then((size: any) => {
      this.map = new L.Map('map', <any>{
          // set map center to center of floor image
          center: L.latLng(-size.height / 2, size.width / 2),
          crs: L.CRS.Simple,
          maxZoom: 4,
          minZoom: -2,
          attributionControl: false,
          zoomSnap: 0,
          contextmenu: true,
          contextmenuWidth: 140,
          contextmenuItems: [{
            text: 'Add Sensor',
            callback: (e) => {
              this.showModalAddSensor(e);
            }
          }]
        },
      );
      // bound by width and height of floor
      const bounds = L.latLngBounds(L.latLng(-size.height, 0), L.latLng(0, size.width));
      this.overlay = L.imageOverlay(photoUrl, bounds).addTo(this.map);
      this.map.fitBounds(bounds);
      this.map.setMaxBounds(bounds.pad(0.5));
      window.dispatchEvent(new Event('resize'));
      this.makeMaker(this.area.sensors);
    }));

  }

  private refreshData() {
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];
    this._areaService.getById(this.areaId).subscribe(resp => {
      this.area = resp.data;
      this.makeMaker(this.area.sensors);
    });
  }

  /**
   * Show modal add sensor
   */
  public showModalAddSensor(e) {
    let modalRef = this._modalService.open(CreateOrUpdateSensorComponent, {
      backdrop: 'static',
      size: 'lg',
      keyboard: false
    });
    modalRef.componentInstance.title = "Add New Sensor";
    modalRef.componentInstance.initialData = {
      locationX: e.latlng.lng,
      locationY: -e.latlng.lat,
      farmId: this.area.farmId,
      areaId: this.area.id,
    };
    modalRef.componentInstance.farms = this.farms;
    modalRef.componentInstance.types = this.types;
    modalRef.result.then(data => {
      if (data) {
        this.refreshData();
      }
    }, (err) => {
    });
  }

  /**
   * Show modal edit sensor
   * @param e
   * @param id
   */
  public showModalEditSensor(e, id: string): void {
    this._sensorService.getById(id).subscribe(sensorResp => {
      let modalRef = this._modalService.open(CreateOrUpdateSensorComponent, {
        backdrop: 'static',
        size: 'lg',
        keyboard: false
      });
      modalRef.componentInstance.title = "Update Sensor";
      modalRef.componentInstance.sensor = sensorResp.data;
      modalRef.componentInstance.farms = this.farms;
      modalRef.componentInstance.types = this.types;
      modalRef.result.then(data => {
        if (data) {
          this.refreshData();
        }
      }, (err) => {
      });
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
      }, (err) => {
      });
    });
  }

}
