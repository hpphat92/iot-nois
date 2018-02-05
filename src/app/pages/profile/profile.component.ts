import { OnInit, Component } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgUploaderOptions } from 'ngx-uploader';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

import { GlobalState } from '../../global.state';
import { AuthService, ProfileService } from '../../services/index';
import { AppSetting } from '../../app.setting';
import { ChangePassword } from './changepassword/changepassword.component';

@Component({
  selector: 'profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})

export class Profile implements OnInit {

  public form: FormGroup;
  public email: AbstractControl;
  public firstName: AbstractControl;
  public lastName: AbstractControl;
  public submitted: boolean = false;
  public avatarUrl: string = '';

  public defaultPicture = 'assets/img/theme/noimage.png';
  public profile: any = {
    picture: this.defaultPicture
  };

  constructor(private router: Router, private toastr: ToastsManager, fb: FormBuilder,
    private route: ActivatedRoute, private profileService: ProfileService, private authService: AuthService,
    private state: GlobalState, private modalService: NgbModal) {

    this.form = fb.group({
      //'username': [''],
      //'fullName': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'email': ['', Validators.compose([Validators.required])],
      'firstName': ['', Validators.compose([Validators.required])],
      'lastName': ['', Validators.compose([Validators.required])],
      //'phoneNumber': [''],
    });

    //this.username = this.form.controls['username'];
    // /this.fullName = this.form.controls['fullName'];
    this.email = this.form.controls['email'];
    this.firstName = this.form.controls['firstName'];
    this.lastName = this.form.controls['lastName'];
    //this.phoneNumber = this.form.controls['phoneNumber'];

  }

  ngOnInit(): void {
    this.setFirstProfileValue();
  }

  /**
   * Set first value profile
   */
  public setFirstProfileValue() {
    var user = this.authService.getUserFromStorage();
    //this.username.setValue(user.username);
    //this.fullName.setValue(user.fullName);
    this.email.setValue(user.email);
    this.firstName.setValue(user.firstName);
    this.lastName.setValue(user.lastName);
    //this.phoneNumber.setValue(user.phoneNumber);
    if (user.avatarUrl) {
      this.defaultPicture = user.avatarUrl;
      this.avatarUrl = user.avatarUrl;
      this.profile.picture = user.avatarUrl;
    }
  }

  public uploaderOptions: NgUploaderOptions = {
    url: `${AppSetting.API_ENDPOINT}/files/upload-avatar`,
    customHeaders: {
      "Authorization": `Bearer ${localStorage.getItem('access_token')}`,
    }
  };

  /**
   * Cpmplete upload avatar 
   * @param event 
   */
  public onUploadCompleted(event) {
    if (event.status == 401) {
      this.toastr.error("Must login", 'Error');
      localStorage.clear();
      this.router.navigateByUrl('/login');
    } else if (event.status == 200) {
      var response = JSON.parse(event.response);
      if (response.message) {

      } else {
        this.avatarUrl = response.data.url;
      }
    } else {
      // error handle
      this.toastr.error("Cannot upload avatar", 'Error');
    }
  }

  public onSubmit(values: Object): void {
    this.submitted = true;
    if (this.form.valid) {

      // Init data to update
      var profile = {
        email: this.email.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        //fullName: this.fullName.value,
        avatarUrl: this.avatarUrl,
        //phoneNumber: this.phoneNumber.value
      }

      this.profileService.put(profile).subscribe(
        response => {
          this.submitted = false;
          this.profileService.get().subscribe(
            response => {
              window.location.reload();
            });
        },
        error => {
          this.submitted = false;
        }, );
    }
  }

  /**
   * Show model
   */
  public showModalChangPassword() {
    const activeModal = this.modalService.open(ChangePassword, {
      size: 'sm',
      backdrop: 'static'
    });
  }
}