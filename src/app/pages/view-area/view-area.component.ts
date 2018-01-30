import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from 'moment';
import { icon, latLng, Layer, marker, tileLayer, Map } from 'leaflet';
import { HubConnection } from '@aspnet/signalr-client';
import { GlobalState } from '../../global.state';

import { AreaService, HubService, SensorService } from '../../services';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

@Component({
  selector: 'nga-view-area',
  styleUrls: ['./view-area.scss'],
  templateUrl: './view-area.html',
})
export class ViewAreaComponent {

  private areaId: string;
  private area: any;
  private types: any;
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
  private chart = {name: '', chartData: [], options: undefined, g: undefined, value: 0, active: true};
  private chartData: any[];
  private oldChartData: any[];
  private hubConnection: HubConnection;
  private sensors: any;
  private overlay: any;
  private selectedSensor: any = null;

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
      this.sensors = resp.data.sensors || [];
      this.devices = resp.data.sensors || [];
      this.initMap(resp.data.photo);

      this.chartActived = true;
      window.dispatchEvent(new Event('resize'));
      if (this.devices.length) {
        this.selectedSensor = this.devices[0];
        setTimeout(() => {
          this._bindGPUCharts(this.devices[0].id);
        });
      }
      this.listenSignalR();
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
        },)
        .on('click', (e) => {
          this.interval && clearInterval(this.interval);
          this.chartActived = true;
          window.dispatchEvent(new Event('resize'));
          setTimeout(() => {
            this._bindGPUCharts(item.id);
            this.selectedSensor = item;
          });
        })
        .on('dragend', (e: any) => {
          const {lat, lng} = e.target.getLatLng();
          item.locationY = -lat;
          item.locationX = lng;
        });
      this.markers.push(newMarker);
      this.map.addLayer(newMarker);
    });
  }

  private listenSignalR(): void {
    this.hubConnection = this._hubService.getHubConnection();
    this.hubConnection.on('realTimeData', resp => {
      this.chartData[resp.deviceId] = resp;
    });
  }

  private _bindGPUCharts(i) {
    function legendFormatter(data) {
      if (data.x == null) {
        // This happens when there's no selection and {legend: 'always'} is set.
        return '<br>' + data.series.map(function (series) {
          return series.dashHTML + ' ' + series.labelHTML
        }).join('<br>');
      }

      let d = new Date(Date.parse(data.xHTML));
      let datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
        d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
      let html = this.getLabels()[0] + ': ' + datestring;
      data.series.forEach(function (series) {
        if (!series.isVisible) return;
        let labeledData = series.labelHTML + ': ' + series.yHTML;
        if (series.isHighlighted) {
          labeledData = '<b>' + labeledData + '</b>';
        }
        html += '<br>' + series.dashHTML + ' ' + labeledData;
      });
      return html;

    }

    const time = Date();
    const sensor = this.sensors.find(function (obj) {
      return obj.id === i;
    });
    this.chart.name = sensor && sensor.name || '';
    this.chart.value = sensor && sensor.value || 0;
    this.chart.chartData = [
      [new Date(), this.chart.value],
    ];
    this.chart.options = {
      dateWindow: [Date.now() - 120000, Date.now()],
      showRoller: false,
      drawPoints: true,
      legend: 'always',
      labels: ['Time', sensor.sensorType.name],
      labelsDiv: this._elementRef.nativeElement.querySelector('.chart-legend'),
      legendFormatter,
      series: {
        'Accelerometer': {axis: 'y'},
      },
      axes: {
        y: {
          valueRange: [0, 50],
          axisLabelFormatter(y) {
            return y + '°C';
          },
        },
      },
    };
    this.chart.g = new (window as any).Dygraph(this._elementRef.nativeElement.querySelector('.chart-area'), this.chart.chartData, this.chart.options);

    this.interval = setInterval(() => {
      this.chart.value = this.chartData && this.chartData[i] && this.chartData[i].value || 0;
      this.chart.chartData.push([new Date(), this.chart.value]);
      this.chart.g.updateOptions({'file': this.chart.chartData});
      this.chart.options.dateWindow[0] += 500;
      this.chart.options.dateWindow[1] += 500;
      this.chart.g.updateOptions({'dateWindow': this.chart.options.dateWindow});
    }, 1000);

    this.getData(i, time);
  }

  private getData(id, time) {
    const data = {
      endTime: moment(time).toISOString(),
    };

    this._sensorService.getTimeData(id, data).subscribe(resp => {
      this.oldChartData = resp.data;
      this.oldChartData = this.oldChartData.map(item => [new Date(item[0]), item[1]]);
      this.chart.chartData = [...this.oldChartData, ...this.chart.chartData];
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
