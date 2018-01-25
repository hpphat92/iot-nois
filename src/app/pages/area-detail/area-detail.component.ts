import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import * as moment from "moment";
import { icon, latLng, Layer, marker, tileLayer, Map } from 'leaflet';
import { HubConnection } from "@aspnet/signalr-client";
import { GlobalState } from '../../global.state';

import { AreaService, HubService, SensorService } from '../../services/index';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

@Component({
  selector: 'area-detail',
  styleUrls: ['./area-detail.scss'],
  templateUrl: './area-detail.html'
})
export class AreaDetail {

  private areaId: string;
  private area: any;
  private types: any;
  private map: Map;
  private devices: any[];
  // Open Street Map definitions
  private LAYER_OSM = tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'Open Street Map' });
  // Values to bind to Leaflet Directive
  private options = {
    layers: [this.LAYER_OSM],
    zoom: 10,
    center: latLng(46.879966, -121.726909)
  };
  private markers: Layer[] = [];
  private interval: any;
  private chartActived: boolean = false;
  private chart = { name: "", chartData: [], options: undefined, g: undefined, value: 0, active: true };
  private chartData: any[];
  private oldChartData: any[];
  private hubConnection: HubConnection;
  private sensors: any;

  constructor(private route: ActivatedRoute, private _areaService: AreaService, private state: GlobalState,
    private _hubService: HubService, private _elementRef: ElementRef, private _sensorService: SensorService) {
  }

  ngOnInit() {
    // get area id from url
    this.route.params.subscribe(params => {
      this.areaId = params['id'];
    });

    this.getSensorType();

    this.chartData = [];
    this._areaService.getById(this.areaId).subscribe(resp => {
      this.state.notifyDataChanged('menu.activeLink', { title: "Area Detail" });
      this.area = resp.data;
      // this.sensors = resp.data.sensors || [];
      // for production
      // this.devices = resp.data.sensors || [];

      // for test
      this.devices = [
        { id: "sensorid1", name: "Sensor 1", locationX: 41.38549, locationY: 2.183442, sensorType: { id: 0, name: 'Temperature (Nhiet Do)' } },
        { id: "sensor2", name: "Sensor 2", locationX: 41.31462, locationY: 2.12851, sensorType: { id: 0, name: 'Temperature (Nhiet Do)' } },
        { id: "sensor3", name: "Sensor 3", locationX: 41.34246, locationY: 2.060189, sensorType: { id: 1, name: 'Humidity (Do Am)' } },
        { id: "sensor4", name: "Sensor 4", locationX: 41.42747, locationY: 2.107911, sensorType: { id: 1, name: 'Humidity (Do Am)' } },
        { id: "sensor5", name: "Sensor 5", locationX: 41.43699, locationY: 2.180008, sensorType: { id: 2, name: 'Air Pollution (O Nhiem Khong Khi)' } },
      ];
      this.sensors = this.devices;

      this.makeMaker(this.devices);

      this.chartActived = true;
      window.dispatchEvent(new Event('resize'));
      setTimeout(() => {
        this._bindGPUCharts(this.devices[0].id);
      });

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
      let newMarker = marker(
        [item.locationX, item.locationY],
        {
          icon: icon({
            iconSize: [25, 41],
            iconAnchor: [13, 41],
            iconUrl: '../../../assets/img/antena_azul.png',
            shadowUrl: '../../../assets/img/marker-shadow.png'
          })
        }
      ).on('click', () => {
        this.interval && clearInterval(this.interval);
        this.chartActived = true;
        window.dispatchEvent(new Event('resize'));
        setTimeout(() => {
          this._bindGPUCharts(item.id);
        });
      });
      this.markers.push(newMarker);
    });
  }

  private listenSignalR(): void {
    this.hubConnection = this._hubService.getHubConnection();
    this.hubConnection.on("realTimeData", resp => {
      this.chartData[resp.deviceId] = resp;
    });
  }

  public onMapReady(map: Map) {
    this.map = map;
    if (this.devices && this.devices.length) {
      map.panTo([this.devices[0].locationX, this.devices[0].locationY]);
    } else {
      this._areaService.getById(this.areaId).subscribe(resp => {

        // for test
        map.panTo([41.38549, 2.183442]);
        map.setZoom(11);

        // for production
        // if (resp.data.sensors.length > 0) {
        //   map.panTo([resp.data.sensors[0].locationX, resp.data.sensors[0].locationY]);
        //   map.setZoom(11);
        // }
      });
    }
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
    let time = Date();
    var sensor = this.sensors.find(function (obj) {
      return obj.id == i;
    });
    // this.chart.name = this.devices && this.devices[i] && this.devices[i].name || "";
    this.chart.name = sensor && sensor.name || "";
    // this.chart.value = this.chartData && this.chartData[i] && this.chartData[i].value || 0;
    this.chart.value = sensor && sensor.value || 0;
    // this.chart.temp = this.chartData && this.chartData[i] && this.chartData[i].temp || 0;
    // this.chart.chartData = [
    //   [new Date(), this.chart.temp, this.chart.value]
    // ];
    this.chart.chartData = [
      [new Date(), this.chart.value]
    ];
    this.chart.options = {
      dateWindow: [Date.now() - 120000,
      Date.now()],
      showRoller: false,
      drawPoints: true,
      legend: 'always',
      // labels: ['Time', 'Accelerometer'],
      labels: ['Time', sensor.sensorType.name],
      labelsDiv: this._elementRef.nativeElement.querySelector(".chart-legend"),
      legendFormatter,
      series: {
        'Accelerometer': { axis: 'y' },
      },
      axes: {
        y: {
          valueRange: [0, 50],
          axisLabelFormatter: function (y) {
            return y + '°C';
          },
        }
      }
    };
    this.chart.g = new (window as any).Dygraph(this._elementRef.nativeElement.querySelector(".chart-area"), this.chart.chartData,
      this.chart.options);

    this.interval = setInterval(() => {
      this.chart.value = this.chartData && this.chartData[i] && this.chartData[i].value || 0;
      // this.chart.temp = this.chartData && this.chartData[i] && this.chartData[i].temp || 0;
      this.chart.chartData.push([new Date(), this.chart.value]);
      // this.chart.chartData.push([new Date(), this.chart.temp, this.chart.value]);
      this.chart.g.updateOptions({ 'file': this.chart.chartData });
      this.chart.options.dateWindow[0] += 500;
      this.chart.options.dateWindow[1] += 500;
      this.chart.g.updateOptions({ 'dateWindow': this.chart.options.dateWindow });
    }, 500);

    this.getData(i, time);
  }

  private getData(id, time) {
    let data = {
      endTime: moment(time).toISOString()
    }

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

  onChange(sensorType) {
    if (sensorType == -1) {
      this.devices = this.sensors;
    }
    else {
      this.devices = this.sensors.filter(obj => {
        return obj.sensorType.id == sensorType;
      });
    }

    this.markers = [];
    this.makeMaker(this.devices);
  }
}
