import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SensorChart } from './sensor-chart-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    SensorChart
  ],
  providers: [
  ]
})
export class SensorChartModule {}
