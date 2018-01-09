import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbActiveModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EqualPasswordsValidator } from "../../../theme/validators/equalPasswords.validator";
import { NgUploaderOptions } from 'ngx-uploader';

import { AreaService } from '../../../services/index';
import { AppSetting } from '../../../app.setting';

@Component({
    selector: 'create-or-update-farm',
    styleUrls: [('./create-or-update.component.scss')],
    templateUrl: './create-or-update.component.html'
})

export class CreateOrUpdateAreaComponent implements OnInit {

    @ViewChild('mytab')
    mytab: NgbTabset

    public title: string;
    public area: any;
    public farms: any[];

    private frm: FormGroup;
    private name: AbstractControl;
    private farmId: AbstractControl;
    private defaultPicture = 'assets/img/theme/noimage.png';
    private profile: any = {
        picture: this.defaultPicture
    };
    private avatarUrl: string = '';

    constructor(private _fb: FormBuilder, private activeModal: NgbActiveModal,
        private _areaService: AreaService, ) {

    }

    ngOnInit() {
        this.frm = this._fb.group({
            name: ['', Validators.required],
            farmId: ['', Validators.required],
        });

        this.name = this.frm.controls['name'];
        this.farmId = this.frm.controls['farmId'];

        if (this.area && this.area.id) {
            this.frm.patchValue(this.area);
            this.avatarUrl = this.area.photo;
            this.profile.picture = this.area.photo;
        }
    }

    public onSubmit(values: Object): void {
        if (this.frm.valid) {
            let value = this.frm.value;
            let data: any = {
                ...this.frm.value,
                photo: this.avatarUrl,
            }

            if (this.area && this.area.id) {
                this._areaService.update(this.area.id, data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            } else {
                this._areaService.create(data).subscribe(resp => {
                    this.activeModal.close(true);
                });
            }
        } else {
            this.frm.controls['name'].markAsDirty();
            this.frm.controls['farmId'].markAsDirty();
            this.focusOnInvalidTab();
        }
    }

    private focusOnInvalidTab(): void {
        if (this.name.invalid || this.farmId.invalid) {
            this.mytab.select('infoTab');
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