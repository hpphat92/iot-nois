import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routing } from './pages.routing';
import { NgaModule } from '../theme/nga.module';
import { AppTranslationModule } from '../app.translation.module';

import { Pages } from './pages.component';
import { CreateOrUpdateSensorComponent } from "./sensors/create-or-update/create-or-update.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmDialogComponent, ConfirmDialogModule } from "../shared/components/confirm-dialog";

@NgModule({
  imports: [CommonModule, AppTranslationModule, NgaModule, routing, ReactiveFormsModule, NgbModule.forRoot(), ConfirmDialogModule
  ],
  declarations: [Pages, CreateOrUpdateSensorComponent],
  entryComponents: [CreateOrUpdateSensorComponent, ConfirmDialogComponent],
})
export class PagesModule {
}
