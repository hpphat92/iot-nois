import { NgModule } from '@angular/core';
import { NgaModule } from '../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SensorChart } from './sensor-chart-data.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
  ],
  declarations: [
    SensorChart
  ],
  exports: [
    SensorChart
  ],
  providers: [
  ]
})
export class SensorChartModule { }
