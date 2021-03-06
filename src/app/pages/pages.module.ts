import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { CreateOrUpdateSensorComponent } from "./sensors/create-or-update/create-or-update.component";
import { SensorChartModalComponent } from "./area-detail/sensor-chart/sensor-chart.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmDialogComponent, ConfirmDialogModule } from "../shared/components/confirm-dialog";
import { TempHumidityChartModule } from "../shared/components/temp-humidity-chart";
import { AtmosphericChartModule } from "../shared/components/atmospheric-chart";

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing, ReactiveFormsModule, NgbModule.forRoot(), ConfirmDialogModule, TempHumidityChartModule, AtmosphericChartModule
  ],
  declarations: [Pages, CreateOrUpdateSensorComponent, SensorChartModalComponent],
  entryComponents: [CreateOrUpdateSensorComponent, ConfirmDialogComponent, SensorChartModalComponent],
})
export class PagesModule {
}
