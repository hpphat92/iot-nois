import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule } from "angular2-datatable";
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';

import { AppTranslationModule } from '../../app.translation.module';
import { NgaModule } from '../../theme/nga.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { User } from './user.component';
import { CreateOrUpdateUserComponent } from './create-or-update/create-or-update.component';
import { ConfirmDialogModule } from '../../shared/components/confirm-dialog';
import { routing } from './user.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    NgaModule,
    DataTableModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    MultiselectDropdownModule,
    ConfirmDialogModule,
    routing
  ],
  declarations: [
    User,
    CreateOrUpdateUserComponent,
  ],
  entryComponents: [
    CreateOrUpdateUserComponent
  ],
  providers: [
  ]
})
export class UserModule { }
