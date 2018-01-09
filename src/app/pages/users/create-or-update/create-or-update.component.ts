import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from "../../../theme/validators/equalPasswords.validator";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { NgUploaderOptions } from 'ngx-uploader';

import { UserService } from '../../../services/index';
import { AppSetting } from '../../../app.setting';

@Component({
    selector: 'create-or-update-user',
    styleUrls: [('./create-or-update.component.scss')],
    templateUrl: './create-or-update.component.html'
})

export class CreateOrUpdateUserComponent implements OnInit {

    @ViewChild('mytab')
    mytab: NgbTabset

    public title: string;
    public user: any;
    public farms: IMultiSelectOption[];

    private defaultPicture = 'assets/img/theme/noimage.png';
    private profile: any = {
        picture: this.defaultPicture
    };
    private frm: FormGroup;
    private firstName: AbstractControl;
    private lastName: AbstractControl;
    private email: AbstractControl;
    private confirmPassword: AbstractControl;
    private avatarUrl: string = '';

    // Default selection
    private selectedFarms: any[];

    // Settings configuration
    mySettings: IMultiSelectSettings = {
        enableSearch: true,
        checkedStyle: 'checkboxes',
        buttonClasses: 'btn btn-outline-secondary btn-block btn-36',
        containerClasses: 'btn-block',
        itemClasses: 'md-12',
        dynamicTitleMaxItems: 3,
        displayAllSelectedText: true,
    };

    // Text configuration
    myTexts: IMultiSelectTexts = {
        checkAll: 'Select all',
        uncheckAll: 'Unselect all',
        checked: 'item selected',
        checkedPlural: 'items selected',
        searchPlaceholder: 'Find',
        searchEmptyResult: 'Nothing found...',
        searchNoRenderText: 'Type in search box to see results...',
        defaultTitle: '--------------- Choose farms --------------------',
        allSelected: 'All selected',
    };

    constructor(private _fb: FormBuilder, private activeModal: NgbActiveModal,
        private _userService: UserService, ) {

    }

    ngOnInit() {
        if (this.user && this.user.id) {
            this.frm = this._fb.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(AppSetting.pattern.email)]],
                password: [''],
                confirmPassword: ['']
            }, { validator: EqualPasswordsValidator.validate('password', 'confirmPassword') });
        } else {
            this.frm = this._fb.group({
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                email: ['', [Validators.required, Validators.pattern(AppSetting.pattern.email)]],
                password: ['', Validators.required],
                confirmPassword: ['']
            }, { validator: EqualPasswordsValidator.validate('password', 'confirmPassword') });
        }

        this.firstName = this.frm.controls['firstName'];
        this.lastName = this.frm.controls['lastName'];
        this.email = this.frm.controls['email'];
        this.confirmPassword = this.frm.controls['confirmPassword'];

        if (this.user && this.user.id) {
            this.frm.patchValue(this.user);
            this.selectedFarms = this.user.farmIds;
            this.avatarUrl = this.user.avatarUrl;
            this.profile.picture = this.user.avatarUrl;
        }
    }

    public onSubmit(values: Object): void {
        if (this.frm.valid) {
            let value = this.frm.value;
            let data: any = {
                ...this.frm.value,
                avatarUrl: this.avatarUrl,
                farmIds: this.selectedFarms
            }
            if (value.password) {
                data.password = value.password;
            }

            if (this.user && this.user.id) {
                this._userService.update(this.user.id, data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            } else {
                this._userService.create(data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            }
        } else {
            this.frm.controls['firstName'].markAsDirty();
            this.frm.controls['lastName'].markAsDirty();
            this.frm.controls['email'].markAsDirty();
            this.frm.controls['password'].markAsDirty();
            this.frm.controls['confirmPassword'].markAsDirty();
            this.focusOnInvalidTab();
        }
    }

    private focusOnInvalidTab(): void {
        if (this.firstName.invalid || this.lastName.invalid || this.email.invalid) {
            this.mytab.select('user-tab-1');
        } else if (this.frm.controls["password"].invalid || this.confirmPassword.invalid) {
            this.mytab.select('user-tab-2');
        }
    }

    public uploaderOptions: NgUploaderOptions = {
        url: `${AppSetting.API_ENDPOINT}/files/upload-images`,
        customHeaders: {
            "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
        }
    };

    /**
     * Cpmplete upload avatar 
     * @param event 
     */
    public onUploadCompleted(event) {
        var response = JSON.parse(event.response);
        if (response.message) {

        } else {
            this.avatarUrl = response.data.url;
            this.profile.picture = response.data.url;
        }
    }

    closeModal() {
        this.activeModal.close();
    }
}