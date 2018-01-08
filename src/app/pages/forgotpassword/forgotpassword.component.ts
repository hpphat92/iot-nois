import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/index';

@Component({
  selector: 'new',
  templateUrl: './forgotpassword.html',
  styleUrls: ['./forgotpassword.scss']
})
export class ForgotPasswordComponent {

  public form: FormGroup;
  public email: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder,
    private rotue: Router,
    private authService: AuthService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.email = this.form.controls['email'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      // Init data model
      var forgotModel = {
        email: this.email.value
      };

      // call service
      this.authService.forgotPassword(forgotModel).subscribe(
        response => {
          this.submitted = false;
          this.rotue.navigateByUrl("login");
        });
    }
  }
}