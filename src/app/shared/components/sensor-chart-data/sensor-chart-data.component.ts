import { Component, ElementRef, Input } from '@angular/core';
import * as moment from 'moment';
import { SensorService } from "../../../services";

@Component({
  selector: 'sensor-chart',
  styleUrls: ['./sensor-chart-data.scss'],
  templateUrl: './sensor-chart-data.html',
})
export class SensorChart {

  @Input()
  public sensor;

  private chart = {name: '', chartData: [], options: undefined, g: undefined, value: 0, active: true};
  private oldChartData: any[];

  constructor(private _elementRef: ElementRef, private _sensorService: SensorService) {
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

  public ngOnInit(): void {
  }
}
