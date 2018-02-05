import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";
import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Area } from './area.component';
import { CreateOrUpdateAreaComponent } from './create-or-update/create-or-update.component';
import { ConfirmDialogModule } from '../../shared/components/confirm-dialog';
import { routing } from './area.routing';

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
    Area,
    CreateOrUpdateAreaComponent
  ],
  entryComponents: [
    CreateOrUpdateAreaComponent
  ],
  providers: [
  ]
})
export class AreaModule { }
