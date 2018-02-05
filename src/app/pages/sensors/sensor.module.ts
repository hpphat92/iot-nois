import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Sensor } from './sensor.component';
import { ConfirmDialogModule } from '../../shared/components/confirm-dialog';
import { routing } from './sensor.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    DataTableModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    ConfirmDialogModule,
    routing
  ],
  declarations: [
    Sensor,
  ],
  providers: [
  ]
})
export class SensorModule { }
