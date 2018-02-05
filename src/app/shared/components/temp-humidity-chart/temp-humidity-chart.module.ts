import { NgModule } from '@angular/core';
import { NgaModule } from '../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TempHumidityChart } from './temp-humidity-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
  ],
  declarations: [
    TempHumidityChart
  ],
  exports: [
    TempHumidityChart
  ],
  providers: [
  ]
})
export class TempHumidityChartModule { }
