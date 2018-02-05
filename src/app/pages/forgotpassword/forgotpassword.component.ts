import { Component, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MovingDirection } from 'ng2-archwizard';
import { ArchwizardModule } from 'ng2-archwizard';

import { AuthService } from '../../services/index';
import { flatten } from '@angular/router/src/utils/collection';
import { Tree } from '@angular/router/src/utils/tree';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: 'new',
  templateUrl: './forgotpassword.html',
  styleUrls: ['./forgotpassword.scss']
})
export class ForgotPasswordComponent {
  @ViewChild(ArchwizardModule)
  wizard: ArchwizardModule

  public form: FormGroup;
  public formCode: FormGroup;
  public formFinish: FormGroup;
  public email: AbstractControl;
  public code: AbstractControl;
  public newPassword: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder,
    private router: Router,
    private rotue: Router,
    private authService: AuthService) {
    this.form = fb.group({
      'email': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.formCode = fb.group({
      'code': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.formFinish = fb.group({
      'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.email = this.form.controls['email'];
    this.code = this.formCode.controls['code'];
    this.newPassword = this.formFinish.controls['newPassword'];
  }

  public canEnterStep2: (MovingDirection) => any = async () => {
    try {
      await this.requestCode();
      return true;
    } catch (e) {
      return false;
    }
  };

  public requestCode(): any {
    this.submitted = true;
    return new Promise((resolve, reject) => {
      if (this.form.valid) {
        // Init data model
        var forgotModel = {
          email: this.email.value
        };

        // call service
        this.authService.forgotPassword(forgotModel, 'step1', false).subscribe(
          response => {
            this.submitted = false;
            resolve();
          },
          error => {
            this.submitted = false;
            reject();
          });
      } else {
        this.submitted = false;
        reject();
      }
    })
  }

  public canEnterStep3: (MovingDirection) => any = async () => {
    try {
      await this.sendCode();
      return true;
    } catch (e) {
      return false;
    }
  };

  public sendCode(): any {
    this.submitted = true;
    return new Promise((resolve, reject) => {
      if (this.formCode.valid) {
        // Init data model
        var codeModel = {
          email: this.email.value,
          code: this.code.value
        };

        // call service
        this.authService.forgotPassword(codeModel, 'step2', false).subscribe(
          response => {
            this.submitted = false;
            resolve();
          },
          error => {
            this.submitted = false;
            reject();
          });
      } else {
        this.submitted = false;
        reject();
      }
    })
  }

  public finish() {
    this.submitted = true;
    if (this.formCode.valid) {
      // Init data model
      var newPasswordModel = {
        email: this.email.value,
        code: this.code.value,
        newPassword: this.newPassword.value
      };

      // call service
      this.authService.forgotPassword(newPasswordModel, 'step3', true).subscribe(
        response => {
          this.router.navigateByUrl('/login');
          this.submitted = false;
        },
        error => {
          this.submitted = false;
        });
    } else {
      this.submitted = false;
    }
  }
}