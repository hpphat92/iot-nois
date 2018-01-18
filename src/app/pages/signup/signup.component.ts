import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { AuthService, ProfileService } from '../../services/index';

@Component({
  selector: 'signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.scss']
})

export class Signup {

  public form: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder, private router: Router, private authService: AuthService,
    private profileService: ProfileService, private toastr: ToastsManager) {

    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {
      let data = {
        email: this.username.value,
        password: this.password.value
      }

      // call api register an account 
      this.authService.signup(data).subscribe(
        response => {
          this.toastr.success("Sign up success", 'Success');
          this.router.navigateByUrl('/login');
        });
    }
  }
}