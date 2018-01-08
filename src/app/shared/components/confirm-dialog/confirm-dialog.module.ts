import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppTranslationModule } from '../../../app.translation.module';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
  ],
  exports: [
    ConfirmDialogComponent,
  ],
  entryComponents: [
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    AppTranslationModule
  ],
  providers: [],
})
export class ConfirmDialogModule { }
