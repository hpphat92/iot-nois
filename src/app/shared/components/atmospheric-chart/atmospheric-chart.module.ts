import { NgModule } from '@angular/core';
import { NgaModule } from '../../../theme/nga.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AtmosphericChart } from './atmospheric-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
  ],
  declarations: [
    AtmosphericChart
  ],
  exports: [
    AtmosphericChart
  ],
  providers: [
  ]
})
export class AtmosphericChartModule { }
