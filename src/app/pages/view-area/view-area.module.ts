import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { LeafletModule } from '../../../../leaflet/leaflet.module';
import { SensorChartModule } from '../../shared/components/sensor-chart-data';

import { ViewAreaComponent } from './view-area.component';
import { routing } from './view-area.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    LeafletModule.forRoot(),
    routing,
    SensorChartModule
  ],
  declarations: [
    ViewAreaComponent,
  ],
  providers: [
  ],
})
export class ViewAreaModule { }
