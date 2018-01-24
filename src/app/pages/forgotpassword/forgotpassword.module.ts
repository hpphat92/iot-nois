import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; ReactiveFormsModule
import { AppTranslationModule } from '../../app.translation.module';
import { ArchwizardModule } from 'ng2-archwizard';

import { ForgotPasswordComponent } from './forgotpassword.component';
import { routing } from './forgotpassword.routing';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    AppTranslationModule,
    ArchwizardModule.forRoot(),
    routing
  ],
  declarations: [
    ForgotPasswordComponent
  ]
})
export class ForgotPasswordModule { }