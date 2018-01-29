import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HubConnection } from '@aspnet/signalr-client/dist/src';
import { GlobalState } from '../../global.state';
import * as L from 'leaflet';
import 'leaflet-contextmenu';
import { AreaService, HubService, SensorService } from '../../services';

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
  private chartActived: boolean = false;
  private chartData: any[];
  private hubConnection: HubConnection;

  constructor(private route: ActivatedRoute, private _areaService: AreaService, private state: GlobalState,
              private _hubService: HubService, private _elementRef: ElementRef, private _sensorService: SensorService) {
  }

  public ngOnInit() {
    // get area id from url
    this.route.params.subscribe(params => {
      this.areaId = params['id'];
    });

    this.getSensorType();
    this.chartData = [];
    this._areaService.getById(this.areaId).subscribe(resp => {
      this.state.notifyDataChanged('menu.activeLink', {title: 'Area Detail'});
      this.area = resp.data;
      this.chartActived = true;
      this.initMap(resp.data.photo);
    });
  }

  private getSensorType() {
    this._sensorService.getTypes().subscribe(typeResp => {
      this.types = typeResp.data;
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
            callback: () => {
            },
          }, {
            text: 'Delete Sensor',
            callback: () => {

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
            callback: () => {
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
}
