import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { icon, latLng, Layer, Map, marker, tileLayer } from 'leaflet';
import { HubConnection } from '@aspnet/signalr-client';
import { GlobalState } from '../../global.state';

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
  private map: Map;
  private devices: any[];
  // Open Street Map definitions
  private LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Open Street Map',
  });
  // Values to bind to Leaflet Directive
  private options = {
    layers: [this.LAYER_OSM],
    zoom: 10,
    center: latLng(0, 0),
    // center: latLng(46.879966, -121.726909)
  };
  private markers: Layer[] = [];
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
      const newMarker = marker(
        [item.locationX, item.locationY],
        {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: '../../../assets/img/antena_azul.png',
            shadowUrl: '../../../assets/img/marker-shadow.png',
          }),
        },
      ).on('click', () => {
        this.interval && clearInterval(this.interval);
        this.chartActived = true;
        window.dispatchEvent(new Event('resize'));
      });
      this.markers.push(newMarker);
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
      this.map = new L.Map('map', {
          // set map center to center of floor image
          center: L.latLng(-size.height / 2, size.width / 2),
          crs: L.CRS.Simple,
          maxZoom: 4,
          minZoom: -2,
          attributionControl: false,
          zoomSnap: 0,
        },
      );
      // bound by width and height of floor
      const bounds = L.latLngBounds(L.latLng(-size.height, 0), L.latLng(0, size.width));
      this.overlay = L.imageOverlay(photoUrl, bounds).addTo(this.map);
      this.map.fitBounds(bounds);
      this.map.setMaxBounds(bounds);
      window.dispatchEvent(new Event('resize'));
    }));

  }
}
