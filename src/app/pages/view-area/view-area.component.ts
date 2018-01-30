import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { icon, latLng, Layer, marker, tileLayer, Map } from 'leaflet';
import { GlobalState } from '../../global.state';

import { AreaService, SensorService } from '../../services';

@Component({
  selector: 'nga-view-area',
  styleUrls: ['./view-area.scss'],
  templateUrl: './view-area.html',
})
export class ViewAreaComponent {

  private areaId: string;
  private types: any;
  private map: Map;
  private area: any;
  private sensors: any;
  private devices: any[];
  private markers: Layer[] = [];
  private interval: any;
  private chartActived: boolean = false;
  private overlay: any;
  private selectedSensor: any = null;

  constructor(private route: ActivatedRoute, private _areaService: AreaService, private state: GlobalState,
    private _elementRef: ElementRef, private _sensorService: SensorService) {
  }

  public ngOnInit() {
    // get area id from url
    this.route.params.subscribe(params => {
      this.areaId = params['id'];
    });

    this.getSensorType();
    this._areaService.getById(this.areaId).subscribe(resp => {
      this.state.notifyDataChanged('menu.activeLink', { title: 'Area Detail' });
      this.area = resp.data;
      this.sensors = resp.data.sensors || [];
      this.devices = resp.data.sensors || [];
      this.initMap(resp.data.photo);
      this.chartActived = true;
      window.dispatchEvent(new Event('resize'));
      if (this.devices.length) {
        this.selectedSensor = this.devices[0];
      }
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
        }, )
        .on('click', (e) => {
          this.interval && clearInterval(this.interval);
          this.chartActived = true;
          window.dispatchEvent(new Event('resize'));
          setTimeout(() => {
            this.selectedSensor = item;
          });
        })
        .on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          item.locationY = -lat;
          item.locationX = lng;
        });
      this.markers.push(newMarker);
      this.map.addLayer(newMarker);
    });
  }

  public closeChart() {
    this.chartActived = false;
    this.interval && clearInterval(this.interval);
    window.dispatchEvent(new Event('resize'));
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

  public onChange(sensorType) {
    if (sensorType == -1) {
      this.devices = this.sensors;
    } else {
      this.devices = this.sensors.filter(obj => {
        return obj.sensorType.id == sensorType;
      });
    }
    this.markers.forEach(obj => {
      this.map.removeLayer(obj);
    })
    this.markers = [];

    this.makeMaker(this.devices);
  }
}
