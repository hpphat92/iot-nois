import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { ProfileService } from '../../../services/index';

@Component({
    selector: 'add-service-modal',
    styleUrls: [('./changepassword.component.scss')],
    templateUrl: './changepassword.component.html'
})

export class ChangePassword implements OnInit {

    public fChangPassword: FormGroup;
    public oldPassword: AbstractControl;
    public newPassword: AbstractControl;
    public confirmNewPassword: AbstractControl;
    public submitted: boolean = false;

    constructor(fb: FormBuilder,
        private activeModal: NgbActiveModal,
        private profileService: ProfileService) {

        this.fChangPassword = fb.group({
            'oldPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            'confirmNewPassword': ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        });

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

            this.profileService.changePassword(passwordModel).subscribe(
                response => {
                    this.closeModal();
                });
        }
    }

    closeModal() {
        this.activeModal.close();
    }
}
