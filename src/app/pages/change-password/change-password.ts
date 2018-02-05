import { Component, OnInit } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../services/index';
import { EqualPasswordsValidator } from "../../theme/validators/equalPasswords.validator";

@Component({
  selector: 'add-service-modal',
  styleUrls: [('./change-password.scss')],
  templateUrl: './change-password.html'
})

export class ChangePassword implements OnInit {

  public fChangPassword: FormGroup;
  public oldPassword: AbstractControl;
  public newPassword: AbstractControl;
  public confirmNewPassword: AbstractControl;
  public submitted: boolean = false;

  constructor(fb: FormBuilder, private profileService: ProfileService) {

    this.fChangPassword = fb.group({
      'oldPassword': ['', Validators.compose([Validators.required])],
      'newPassword': ['', Validators.compose([Validators.required])],
      'confirmNewPassword': ['', Validators.compose([Validators.required])],
    }, { validator: EqualPasswordsValidator.validate('newPassword', 'confirmNewPassword') });

    this.oldPassword = this.fChangPassword.controls['oldPassword'];
    this.newPassword = this.fChangPassword.controls['newPassword'];
    this.confirmNewPassword = this.fChangPassword.controls['confirmNewPassword'];
  }

  ngOnInit() { }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.fChangPassword.valid) {

      // Init data to update
      var passwordModel = {
        oldPassword: this.oldPassword.value,
        newPassword: this.newPassword.value,
      }

      this.profileService.changePassword(passwordModel).subscribe(resp => {
        this.submitted = false;
      });
    }
  }
}