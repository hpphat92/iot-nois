import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppTranslationModule } from '../../app.translation.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgaModule } from '../../theme/nga.module';

import { Profile } from './profile.component';
import { routing } from './profile.routing';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ChangePassword } from './changepassword/changepassword.component';

@NgModule({
  imports: [
    CommonModule,
    AppTranslationModule,
    ReactiveFormsModule,
    FormsModule,
    NgaModule,
    NgbModalModule,
    routing
  ],
  declarations: [
    Profile,
    ChangePassword
  ],
  entryComponents: [
    ChangePassword
  ],
})
export class ProfileModule { }
