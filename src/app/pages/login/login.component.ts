import { Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService, ProfileService } from '../../services/index';

@Component({
  selector: 'login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})

export class Login {

  public form: FormGroup;
  public username: AbstractControl;
  public password: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService) {

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
      this.authService.signin(this.username.value, this.password.value).subscribe(
        response => {
          this.getProfile();
        });
    }
  }

  public getProfile(): void {
    this.profileService.get().subscribe(
      response => {
        this.router.navigateByUrl('/dashboard');
      },
      error => { },
      () => { }
    );
  }
}