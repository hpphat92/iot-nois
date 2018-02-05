import { OnInit, Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AuthService } from '../../services/index';

@Component({
  selector: 'new',
  templateUrl: './resetpassword.html',
  styleUrls: ['./resetpassword.scss']
})
export class ResetPasswordComponent implements OnInit {

  public form: FormGroup;
  public password: AbstractControl;
  public confirmNewPass: AbstractControl;
  public submitted: boolean = false;
  public token: string;

  constructor(fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private rotue: Router,
    private authService: AuthService) {

    this.form = fb.group({
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'confirmNewPass': ['', Validators.compose([Validators.required, Validators.minLength(4)])]
    });

    this.password = this.form.controls['password'];
    this.confirmNewPass = this.form.controls['confirmNewPass'];
  }

  ngOnInit() {
    // subscribe to router event
    this.activatedRoute.params.subscribe((params: Params) => {
      this.token = params['token'];
    });
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {

      // Init data model
      var resetModel = {
        token: this.token,
        newPassword: this.password.value
      };

      // call service
      this.authService.resetPassword(resetModel).subscribe(
        response => {
          this.submitted = false;
          this.rotue.navigateByUrl("login");
        });
    }
  }
}