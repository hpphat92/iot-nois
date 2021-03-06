import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from "../../../theme/validators/equalPasswords.validator";
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { NgUploaderOptions } from 'ngx-uploader';

import { FarmService } from '../../../services/index';
import { AppSetting } from '../../../app.setting';

@Component({
    selector: 'create-or-update-farm',
    styleUrls: [('./create-or-update.component.scss')],
    templateUrl: './create-or-update.component.html'
})

export class CreateOrUpdateFarmComponent implements OnInit {

    @ViewChild('mytab')
    mytab: NgbTabset

    public title: string;
    public farm: any;
    public users: IMultiSelectOption[];
    private frm: FormGroup;
    private name: AbstractControl;
    private emails: string[];
    private email: AbstractControl;

    // Default selection
    private selectedUsers: any[];

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
        defaultTitle: '--------------- Choose users --------------------',
        allSelected: 'All selected',
    };

    constructor(private _fb: FormBuilder, private activeModal: NgbActiveModal,
        private _farmService: FarmService, ) {
        this.emails = [];
    }

    ngOnInit() {
        this.frm = this._fb.group({
            name: ['', Validators.required],
            email: [''],
        });

        this.name = this.frm.controls['name'];
        this.email = this.frm.controls['email'];

        if (this.farm && this.farm.id) {
            this.frm.patchValue(this.farm);
            this.selectedUsers = this.farm.userIds;
            this.emails = this.farm.emails;
        }
    }

    public onSubmit(values: Object): void {
        if (this.frm.valid) {
            let value = this.frm.value;
            let data: any = {
                ...this.frm.value,
                userIds: this.selectedUsers,
                emails: this.emails
            }

            if (this.farm && this.farm.id) {
                this._farmService.update(this.farm.id, data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            } else {
                this._farmService.create(data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            }
        } else {
            this.frm.controls['name'].markAsDirty();
            this.focusOnInvalidTab();
        }
    }

    private focusOnInvalidTab(): void {
        if (this.name.invalid) {
            this.mytab.select('infoTab');
        }
    }

    private addEmail(): void {
        if (this.email.value && this.email.valid && !this.emails.includes(this.email.value)) {
            this.emails.push(this.email.value);
            this.email.setValue('');
        }
    }

    private deleteEmail(index): void {
        this.emails.splice(index, 1);
    }

    closeModal() {
        this.activeModal.close();
    }
}