import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../app.translation.module';

import { ResetPasswordComponent } from './resetpassword.component';
import { routing } from './resetpassword.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppTranslationModule,
    routing
  ],
  declarations: [
    ResetPasswordComponent
  ]
})
export class ResetPasswordModule {}